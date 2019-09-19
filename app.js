const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
const tmi = require('tmi.js');
const fetch = require('node-fetch');
const { EmoteFetcher, EmoteParser } = require('twitch-emoticons');
const fetcher = new EmoteFetcher();
info = require('./info.js')
const parser = new EmoteParser(fetcher, {
    type: 'markdown',
    match: /:(.+?):/g
});
const headers = {
    'Client-ID': info.key
};

function helix(endpoint, qs) {
    const queryString = new URLSearchParams(qs);
    const url = `https://api.twitch.tv/helix/${endpoint}?${queryString}`;
    return fetch(url, { headers })
    .then(res => res.json())
}

function splice(start, end, insert, message){
    startStr = message.slice(end);
    endStr = message.slice(0, start);
    message = startStr + insert + endStr
}

function emoteParse(emoteInf, msg) {
    const emoturl = `https://static-cdn.jtvnw.net/emoticons/v1/${emotenum}/1.0`;
    emoteNum = emoteInf

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

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
};

function onMessageHandler (channel, tags, message, self) {

    const { 'user-name': username, 'display-name': displayName, 'user-id': userID, 'subscriber': sub, 'emotes': emote } = tags;

    if(emote != null) {
        console.log(emote);
        var midLoc = emote.indexOf(':');
        console.log(midLoc);

    }
    else {
        console.log('i think we messed up if theres an emote');
    }

    console.log('twitch', `${displayName} : ${message}`);
    //console.log(tags);
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
            /*fetcher.fetchTwitchEmotes().then(() => {
                const parsed = parser.parse(message);
                console.log(parsed);
            }); */
            console.log(`${name} -- ${props}`);
            const profileElment = `<img class="profImg" src="${profile_image_url}" alt="null" id="itemImg">`
            io.emit('twitch', `${ profileElment} ${displayName}: ${message}`);
        }
    });
};

const client = new tmi.client(config);

client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler)

client.connect();

client.addListener('message', function(from, message) {
    console.log('message seen');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
        console.log(
            'user ' + socket.username + ' connected'
        );
    });
    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(80, function() {
    console.log('listening on *:80');
});
