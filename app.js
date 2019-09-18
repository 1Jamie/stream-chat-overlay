const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
var irc = require('irc');
const tmi = require('tmi.js');

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

    console.log('twitch', tags + ' ' + message);
    console.log(tags[4]);
    io.emit('twitch', message);
};

client.on('message', (channel, tags, message, self) => {
    if(self) return;
    const { username: login, 'display-name': displayName, 'user-id': userID } = tags;
    client.say(channel, `${displayName} (@${login}), your user ID is ${userID}`);
});

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
