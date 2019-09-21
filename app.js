const express = require('express');
const app = express();
const Pool = require('pg').Pool
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
const tmi = require('tmi.js');
const fetch = require('node-fetch');
const { EmoteFetcher, EmoteParser } = require('twitch-emoticons');
const fetcher = new EmoteFetcher();
app.use("/css",express.static(__dirname + "/css"));
info = require('./info.js');
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
});
const headers = {
    'Client-ID': info.key
};

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'emotes',
    password: 'password',
    port: 5432,
  });

const getCheerUrl = function(cheerW, usr){
    pool.query(`select cheer, url from cheers`).then( res => {
        const result = res.rows
        var message1
        var inDb 
        var done
        console.log('there was a cheer')
        for ( x = 0; x < result.length; x++ ){
            console.log( `just the object`, result[x]);
            console.log( `grab further`, result[x].cheer )
            indexVal = cheerW.indexOf(result[x].cheer);
            console.log('userstate', usr)
            console.log(indexVal);
            if( indexVal != -1 ) {
                message1 = cheerW 
                while (message1.indexOf(result[x].cheer) != -1  ) {
                    message1 = message1.replace(result[x].cheer, `<img class="emoteImg" src="${result[x].url}">`);
                    console.log(message1);
                    message1 = `${usr.username} : ${message1}` 
                    console.log(result.user-id);
                    done = 1; 
                }
                break
            }
            else{
                console.log('no db entry')
                inDb = false;
            }     
        } 
        if (done != 1) {
            io.emit(`cheer`, cheerW);
            console.log('cheer was made with no entry in DB', cheerw);
        }
        else{
            io.emit(`cheer`, message1);
            console.log('message1');
        }
    })
}


 
//this is the function for making the helix calls as you can see
function helix(endpoint, qs) {
    const queryString = new URLSearchParams(qs);
    const url = `https://api.twitch.tv/helix/${endpoint}?${queryString}`;
    return fetch(url, { headers })
    .then(res => res.json())
}


function splice(start, end, insert, message){
    startStr = message.slice(0, start);
    console.log(startStr);
    console.log(end);
    endStr =  message.slice(end);
    messageOut = startStr + insert + endStr;
}

function emoteParse(emoteInf, msg) {

}

function getUser(id) {
    return helix('users', { id })
    .then(({ data: [ user ] }) => user || null);
}



app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index.ejs');
});

var config = {
    identity: {
        username: "charja113",
        password: info.oauth,
    },
    channels: [
        'charja113'
    ]
};
function onCheer(channel, userstate, message){
    console.log(userstate);
    console.log('message: ' + message);
    getCheerUrl(message, userstate);

}

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
};

function onMessageHandler (channel, tags, message, self) {
    var message1

    const { 'user-name': username, 'display-name': displayName, 'user-id': userID, 'subscriber': sub, 'emotes': emote } = tags;
    console.log(emote);
    var commandName = message.trim();
    if ( (displayName == 'StreamElements') || (displayName == 'PretzelRocks') ) {
        console.log(`botmessage`)
        return
    }

    if(commandName === '!project'){
        client.say(channel, `the project page is https://gitlab.streamchatoverlay.xyz/jamie/streamchatoverlay`);
        console.log('project command seen, message should be sent');
    }


    if(emote != null) {
        message1 = message;
        var keyCount  = Object.keys(emote).length
        Object.keys(emote).forEach(function(key){
            console.log(key, emote[key] );
            var emoteUrl = `<img class="emoteImg" src="https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0" alt="${key}" id="${key}">`;
            var placement = JSON.stringify(emote[key])
            console.log(placement.indexOf('-'))
            var dashLoc = placement.indexOf('-')
            var furstnum = placement.slice(2, dashLoc )
            console.log( furstnum)
            var secondnum = placement.slice(parseInt(dashLoc, 10)+1, parseInt(placement.length)-2)
            console.log(secondnum)
            var rmWord = message.slice(furstnum, parseInt(secondnum)+1)
            console.log('rmwork: ' + rmWord)
            message1 = message1.replace(rmWord, emoteUrl )
            console.log(message1);
            return message1
            });
    }
    else {
        console.log('i think we messed up if theres an emote');
        message1 = message;
    }

    console.log('twitch', `${displayName} : ${message1}`);
    console.log(tags);
    getUser(userID)
        .then(user => {
        if(!user) {
            console.log('User not found');
        }
        else {
            const {
                id, display_name, login,
                broadcaster_type, view_count, profile_image_url
            } = user;
            const name = `[${id}] ${display_name} (${login})`;
            const props = `${broadcaster_type}, ${view_count} view(s), image: ${profile_image_url}`;
            console.log(`${name} -- ${props}`);
            const profileElment = `<img align="left" style="padding-right: 3px;" class="profImg" src="${profile_image_url}" alt="null" id="itemImg">`
            io.emit('twitch', `${ profileElment}<p>${displayName}:</p>  <p>${message1}</p></br>`);
        }
    });
};

const client = new tmi.client(config);

client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler)
client.on('cheer', onCheer);

client.connect();

client.addListener('message', function(from, message) {
    console.log('message seen');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        console.log(
            'user ' + socket.username + ' connected'
        );
    });
    socket.on('disconnect', function(username) {
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(80, function() {
    console.log('listening on *:80');
});
