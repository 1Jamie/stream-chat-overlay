const express = require('express');

const app = express();
const { Pool } = require('pg');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const tmi = require('tmi.js');
// const once = require('lodash.once');
const fetch = require('node-fetch');

app.use('/css', express.static(`${__dirname}/css`));
const info = require('./info.js');

const headers = {
  'Client-ID': info.key,
};

// const badge_icons = _.once(async () => (await fetch('https://badges.twitch.tv/v1/badges/global/display')).json());

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'emotes',
  password: 'password',
  port: 5432,
});

// this is the function for making the helix calls as you can see
function helix(endpoint, qs) {
  const queryString = new URLSearchParams(qs);
  const url = `https://api.twitch.tv/helix/${endpoint}?${queryString}`;
  return fetch(url, { headers })
    .then((res) => res.json());
}

function getUser(id) {
  return helix('users', { id })
    .then(({ data: [user] }) => user || null);
}


const getCheerUrl = function (cheerW, usr) {
  pool.query('select cheer, url from cheers').then((res) => {
    const result = res.rows;
    let message1;
    let done;
    // console.log('there was a cheer');
    for (let x = 0; x < result.length; x++) {
      // console.log('just the object', result[x]);
      // console.log('grab further', result[x].cheer);
      const indexVal = cheerW.indexOf(result[x].cheer);
      console.log('userstate', usr);
      // console.log(indexVal);
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
      } else {
        // console.log('no db entry');
      }
    }
    if (done !== 1) {
      io.emit('cheer', cheerW);
      // console.log('cheer was made with no entry in DB', cheerW);
    } else {
      getUser(usr['user-id'])
        .then((user) => {
          if (!user) {
            // console.log('User not found');
          } else {
            const {
              id, display_name, login,
              broadcaster_type, view_count, profile_image_url,
            } = user;
            const name = `[${id}] ${display_name} (${login})`;
            props = `${broadcaster_type}, ${view_count} view(s), image: ${profile_image_url}`;
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

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

const config = {
  identity: {
    username: 'charja113',
    password: info.oauth,
  },
  channels: [
    'charja113',
  ],
};
function onCheer(channel, userstate, message) {
  // console.log(userstate);
  // console.log(`message: ${message}`);
  getCheerUrl(message, userstate);
}

function onConnectedHandler(addr, port) {
  client.join('Samma_FTW');
  // console.log(`* Connected to ${addr}:${port}`);
}

function onMessageHandler(channel, tags, message, self) {
  let message1;

  const {
    'user-name': username, 'display-name': displayName, 'user-id': userID, subscriber: sub, emotes: emote,
  } = tags;
  const commandName = message.trim();
  if ((displayName === 'StreamElements') || (displayName === 'PretzelRocks')) {
    console.log('botmessage');
    return;
  }

  if (commandName === '!project') {
    client.say(channel, 'the project page is https://gitlab.streamchatoverlay.xyz/jamie/streamchatoverlay');
    console.log('project command seen, message should be sent');
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
      message1 = message1.replace(rmWord, emoteUrl);

      if (rmWord === ':/') {
        console.log('emote :/ was seen, bypassing second replace to prevent infinte loop issue # 6');
      } else {
        while (message1.indexOf(rmWord) !== -1) {
        message1 = message1.replace(rmWord, emoteUrl)
          console.log('there was more than one instance repalcing')
        }}
      // console.log(message1);
      return message1;
    });
  } else {
    // console.log('i think we messed up if theres an emote');
    message1 = message;
  }

  // console.log('twitch', `${displayName} : ${message1}`);
  // c onsole.log(tags);
  getUser(userID)
    .then((user) => {
      if (!user) {
        // console.log('User not found');
      } else {
        const {
          id, display_name, login,
          broadcaster_type, view_count, profile_image_url,
        } = user;
        const name = `[${id}] ${display_name} (${login})`;
        const props = `${broadcaster_type}, ${view_count} view(s), image: ${profile_image_url}`;
        // console.log(`${name} -- ${props}`);
        console.log(channel);
        const profileElment = `<img align="left" style="padding-right: 3px;" class="profImg" src="${profile_image_url}" alt="null" id="itemImg">`;
        io.emit('twitch', `${profileElment}<p>${displayName}: - ${channel}</p>  <p>${message1}</p></br>`);
      }
    });
}

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

  socket.on('chat_message', (message) => {
    io.emit('chat_message', `<strong>${socket.username}</strong>: ${message}`);
  });
});

const server = http.listen(80, () => {
  console.log('listening on *:80');
});
