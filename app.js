const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
const tmi = require('tmi.js');
const fetch = require('node-fetch');
const headers = {
    'Client-ID': 'xf97asgwy19p4eqp26q052adtox710'
};

function helix(endpoint, qs) {
    const queryString = new URLSearchParams(qs);
    const url = `https://api.twitch.tv/helix/${endpoint}?${queryString}`;
    return fetch(url, { headers })
    .then(res => console.log(res))
}
/*
function getUser(id) {
    return helix('users', { id })
    .then(({ data: [ user ] }) => user || null);
}

const userID = '7676884';
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
    }
}); */

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index.ejs');
});

var config = {
    identity: {
        username: "charja113",
        password: "oauth:fzr7ox5bh74qagnt6aitux9ehpia5w",
    },
    channels: [
        'charja113'
    ]
};

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
};

function onMessageHandler (channel, tags, message, self) {
    //if (self) { return; } // Ignore messages from the bot
    // Remove whitespace from chat message
    const { 'user-name': username, 'display-name': displayName, 'user-id': userID } = tags;
    console.log('twitch', `${displayName} : ${message}`);
    //curl.get(`https://api.twitch.tv/kraken/users?login=${username}`)
    console.log(tags);
    io.emit('twitch', `${displayName}: ${message} ${username}`);
    helix('users', `userid=${userID}`)
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
