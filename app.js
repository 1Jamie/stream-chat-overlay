//setting the stuff we need for node (still need to fix deps)
const express = require('express');
const app = express();
const {
  Pool
} = require('pg');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const tmi = require('tmi.js');
const fetch = require('node-fetch');
let multi = 'off'
app.use(express.static('public'));

//set our resources and pages
app.get('/', (req, res) => {
  res.render('index.ejs');
});
app.get('/admin', (req, res) => {
  res.render('admin.ejs');
});
app.use('/css', express.static(`${__dirname}/css`));
const info = require('./info.js');

const headers = {
  'Client-ID': info.key,
};
// const badge_icons = _.once(async () => (await fetch('https://badges.twitch.tv/v1/badges/global/display')).json());

//setup our postgresql information we are going to need 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'emotes',
  port: 5432,
});

// this is the function for making the helix calls as you can see
function helix(endpoint, qs) {
  const queryString = new URLSearchParams(qs);
  const url = `https://api.twitch.tv/helix/${endpoint}?${queryString}`;
  return fetch(url, {
      headers
    })
    .then((res) => res.json());
}

//this does does the obvious... gets users info using helix call
function getUser(id) {
  return helix('users', {
      id
    })
    .then(({
      data: [user]
    }) => user || null).catch(console.log("here!"));
}

//this is going to handle our cheers when called console logs left for debugging if needed later
const getCheerUrl = function (cheerW, usr) {
  pool.query('select cheer, url from cheers order by id desc').then((res) => {
    const result = res.rows;
    let message1;
    let done;
    // console.log('there was a cheer');
    for (let x = 0; x < result.length; x++) {
      // console.log('just the object', result[x]);
      // console.log('grab further', result[x].cheer);
      const indexVal = cheerW.indexOf(result[x].cheer);
      console.log('userstate', usr);
      if (indexVal !== -1) {
        message1 = cheerW;
        while (message1.indexOf(result[x].cheer) !== -1) {
          message1 = message1.replace(result[x].cheer, `<img class="emoteImg" src="${result[x].url}">`);
          // console.log(message1);
          message1 = `${usr.username}: </br> ${message1}`;
          // console.log(usr['user-id']);
        }
        done = 1;
        break;
      }
    }
    if (done !== 1) {
      //tjos wo;; send the message even know there was no cheer in the db... which whoops
      io.emit('cheer', cheerW);
      // console.log('cheer was made with no entry in DB', cheerW);
    } else {
      //this is gonna handle the proper cheer and build the cheer message since its a different event than messges
      getUser(usr['user-id'])
        .then((user) => {
          if (!user) {
            // console.log('User not found');
          } else {
            const {
              id,
              display_name,
              login,
              broadcaster_type,
              view_count,
              profile_image_url,
            } = user;
            //const name = `[${id}] ${display_name} (${login})`;
            //const props = `${broadcaster_type}, ${view_count} view(s), image: ${profile_image_url}`;
            // console.log(`${name} -- ${props}`);
            const profileElment = `<img align="left" style="padding-right: 3px;" class="profImg" src="${profile_image_url}" alt="null" id="itemImg">`;
            message1 = `${profileElment} ${message1}`;
            // console.log('message content', message1);
            io.emit('cheer', message1);
          }
        });
    }
  });
};

//this is going to define the twitch tmi sign in info and channels to sign into
const config = {
  identity: {
    username: 'charja113',
    password: info.oauth,
  },
  channels: [

    'charja113'

  ],
};

//this handles the cheers when they happen
function onCheer(channel, userstate, message) {
  getCheerUrl(message, userstate);
}

function onCngPsswd(psswdInf, fn){
  console.log(psswdInf);
  let psswdPg = 'update users set password=$3 where username=$1 and password=$2 '
  pool.query(psswdPg, psswdInf, (err, res) => {
    if(err) {
      fn(err)
      console.log(err);
    }
    else{
      fn(res)
      console.log(res);
    }
  })
}

//We are gonna deal with the admin pannel here, it will both start up authentication and then were gonna server up the bot commands
function onAdminCon(conninfo) {
  console.log(conninfo);
  const text = 'select * from users where password=$2 and username=$1'
  pool.query(text, conninfo, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      //console.log(res);
      if (res.rowCount != 0) {
        io.emit('authEmit', ['permit', res.rows[0].channel])
        //console.log(res);
        //const commands_query = "select * from commands where user_name='" + conninfo[0] +"'";
        //console.log(commands_query)
        pool.query('select command_name, response, id, user_name from commands where user_name=$1', [res.rows[0].channel], (err, res) => {
          if (err) {
            console.log(err.stack)
          } else {
            //console.log(res)
            io.emit('sendcommands', res)
          }
        })
        pool.query('select word, value, uid, channel from word_filter where channel=$1', [res.rows[0].channel], (err, res) => {
          if (err) {
            console.log(err.stack)
          } else {
            io.emit('filters', res)
          }
        })
      } else {
        io.emit('authEmit', 'deny')
      }
    }
  })
}

function onCmdChange(cmdInf) {
  const cmdtxt = 'update commands set response=$2 where id=$1'
  pool.query(cmdtxt, cmdInf, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(`command updated with values ${cmdInf}`)
    }
  })
}

function ondeleteCmd(cmdInf) {
  const text = 'delete from commands where id=$1';
  pool.query(text, cmdInf, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(`command ${cmdInf} deleted`)
    }
  })
}

function ondeleteWrd(cmdInf) {
  console.log(cmdInf);
  const text = 'delete from word_filter where uid=$1'
  pool.query(text, cmdInf, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`word with id ${cmdInf} deleted`)
    }
  });
}

function onnewwrd(cmdInf) {
  console.log(cmdInf);
  pool.query('insert into word_filter (channel, word, value) values ($3, $1, $2)', cmdInf, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(`command ${cmdInf} added`)
      let userar = [cmdInf[2]]
      //console.log(userar)
      pool.query('select word, value, uid, channel from word_filter where channel=$1', userar, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          //console.log(res)
          io.emit('filters', res)
        }
      })
    }
  })
}

function onaddCmd(cmdInf) {
  const text = "insert into commands (user_name, command_name, response) values ($3 , $1 , $2)"
  pool.query(text, cmdInf, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`command ${cmdInf} added`)
      let userar = [cmdInf[2]]
      //console.log(userar)
      pool.query('select command_name, response, id, user_name from commands where user_name=$1', userar, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          //console.log(res)
          io.emit('sendcommands', res)
        }
      })
    }
  })
}
//this is going to define the obvious "connectionHadler"
function onConnectedHandler(addr, port) {
  // console.log(`* Connected to ${addr}:${port}`);
}

//This is going to define how the messages are handled when the event happens
function onMessageHandler(channel, tags, message, self) {
  let message1;
  let postMsg = true

  const {
    'user-name': username,
    'display-name': displayName,
    'user-id': userID,
    subscriber: sub,
    emotes: emote,
  } = tags;

  const commandName = [message.trim(), channel.substr(1)]

  pool.query('select response from commands where command_name=$1 and user_name=$2', commandName, (err, res) => {
    //console.log(commandName)
    //console.log(res)
    if (res.rowCount != 0) {
      client.say(channel, res.rows[0].response)
    }
  })

  console.log(commandName[1]);

  pool.query('select word, value from word_filter where channel=$1', [commandName[1]], (err, res) =>{
    if (err) {
      console.log(err)
    } else {
      let row = 0 
      let msgVal = 0
      console.log(res.rowCount)
      for ( i=0;i<parseInt(res.rowCount);i++){
        console.log(res.rows[row].word);
        if ( message.indexOf(res.rows[row].word) !== -1 ) {
          //console.log(res.rows[row].value)
          msgVal = msgVal + parseInt(res.rows[row].value);
          //console.log(msgVal)
        } else {
          //
        }
        console.log(msgVal)
        console.log(row)
        row++
      }
      if (msgVal >= 6){
        console.log('run for the hills! bad message!')
        postMsg = false;

      }
      //console.log(res)
    }
  })
  
  if (commandName === '!multimsg') {
    if ((displayName === 'Charja113') || (displayName === 'Samma_FTW')) {
      if (multi === 'off') {
        multi = 'on'
        console.log('multi link turned on')
        client.join('samma_ftw')
        //client.say('samma_ftw', 'multi link message: on')
        client.say('charja113', 'multi link message: on')
        multiIntervalc = setInterval(function () {
          client.say('charja113', "Want to get in the action from both sides? The Multi twitch link to watch both streams is http://multitwitch.tv/charja113/samma_ftw")
        }, 500000);
        //multiIntervalm =  setInterval(function(){
        // client.say('samma_ftw', "Want to get in the action from both sides? The Multi twitch link to watch both streams is http://multitwitch.tv/charja113/samma_ftw")
        //}, 500000);
        return multi
      } else {
        clearInterval(multiIntervalc);
        //clearInterval(multiIntervalm);
        client.part('samma_ftw')
        //client.say('samma_ftw', 'multi link message: off')
        client.say('charja113', 'multi link message: off')
        multi = 'off'
        console.log('multi link turned off')
        return multi
      }
    }
  }

  if (commandName === '!multitwitch') {
    client.say(channel, "Want to get in the action from both sides? The Multi twitch link to watch both streams is http://multitwitch.tv/charja113/samma_ftw")
  }
  if ((displayName === 'StreamElements') || (displayName === 'PretzelRocks') || (displayName === 'Charja113') || (displayName === 'Samma_FTW')) {
    console.log('botmessage or streamer');
    return;
  }

  if (emote !== null) {
    message1 = message;
    const keyCount = Object.keys(emote).length;
    Object.keys(emote).forEach((key) => {
      // console.log(key, emote[key]);
      const emoteUrl = `<img class="emoteImg" src="https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0">`;
      const placement = JSON.stringify(emote[key]);
      // console.log(placement.indexOf('-'));
      const dashLoc = placement.indexOf('-');
      const furstnum = placement.slice(2, dashLoc);
      // console.log(furstnum);
      const secondnum = placement.slice(parseInt(dashLoc, 10) + 1, parseInt(placement.length) - 2);
      // console.log(secondnum);
      const rmWord = message.slice(furstnum, parseInt(secondnum) + 1);
      // console.log(`rmwork: ${rmWord}`);
      // console.log(`rmwork: ${rmWord}`);
      message1 = message1.replace(rmWord, emoteUrl);
      if (rmWord === ':/') {
        console.log('emote :/ was seen, bypassing second replace to prevent infinte loop issue # 6');
      } else {
        while (message1.indexOf(rmWord) !== -1) {
          message1 = message1.replace(rmWord, emoteUrl)
          console.log('there was more than one instance repalcing')
        }
      }
      // console.log(message1);
      return message1;
    });
  } else {
    // console.log('i think we messed up if theres an emote');
    message1 = message;
  }
  getUser(userID)
    .then((user) => {
      if (!user) {
        // console.log('User not found');
      } else {
        const {
          id,
          display_name,
          login,
          broadcaster_type,
          view_count,
          profile_image_url,
        } = user;
        let channelLogo
        const name = `[${id}] ${display_name} (${login})`;
        const props = `${broadcaster_type}, ${view_count} view(s), image: ${profile_image_url}`;
        switch (channel) {
          case '#samma_ftw':
            channelLogo = `<img align="left" style="padding-right: 3px;" class="chanlogo" src="/css/samma-logo.png" alt="null" id="itemImg">`;
            break;
          case '#charja113':
            channelLogo = `<img align="left" style="padding-right: 3px;" class="chanlogo" src="/css/charja_logo_head.png" alt="null" id="itemImg">`
            break;
        }

        // console.log(`${name} -- ${props}`);
        const profileElment = `<img align="left" style="padding-right: 3px;" class="profImg" src="${profile_image_url}" alt="null" id="itemImg">`;
        if (postMsg === true) {
        io.emit('twitch', `${profileElment}<p> ${channelLogo} ${displayName}:</p>  <p class="msg">${message1}</p></br>`);
        } else {
          console.log('message emitted for filter reasons')
        }
      }
    });
}

//this is close to what i would call the event area or loop (not actually a loop though, just a term)
const client = new tmi.client(config);
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.on('cheer', onCheer);

client.connect();

io.sockets.on('connection', (socket) => {
  socket.on('username', (username) => {
    socket.username = username;
    // console.log(  `user ${socket.username} connected`,);
  });
  socket.on('adminCon', onAdminCon);
  socket.on('command_change', onCmdChange);
  socket.on('newcmd', onaddCmd);
  socket.on('deleteCmd', ondeleteCmd);
  socket.on('deleteWrd', ondeleteWrd);
  socket.on('newwrd', onnewwrd)
  socket.on('psswdCng', onCngPsswd)
  socket.on('chat_message', (message) => {
    io.emit('chat_message', `<strong>${socket.username}</strong>: ${message}`);
  });
});
// this is going to be the handling of the admin page events


const server = http.listen(8085, () => {
  console.log('listening on *:8085');
});
