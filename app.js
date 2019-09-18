const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
var irc = require('irc');
const tmi = require('tmi.js');
//var ircconf = [
//    options : {channels:['#charja113'], port: 6667, seucure: true, userName: 'charbot', realname: 'charbot'},
//    ]

// viewed at http://localhost:8080
//app.get('/', function(req, res) {
//    res.sendFile('/home/jamie/StreamChatOverlay/index.html');
//    res.sendFile('/home/jamie/StreamChatOverlay/public/twitch.js');
//    res.sendFile('/home/jamie/StreamChatOverlay/public/youtube.js');
//});

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

function onMessageHandler (username, target, channel, tags, message, self) {
    if (self) { return; } // Ignore messages from the bot
  
    // Remove whitespace from chat message
    console.log('from ' + username + ' target ' + target + ' context ' + context + ' msg ' + msg + ' self ' + self)
};


app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index.ejs');
});

const client = new tmi.client(config);

client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler)

client.addListener('message', function(from, message) {
    io.emit(from + ' : ' + message );
    console.log('message seen');
});

io.sockets.on('connection', function(socket) {
    client.connect();
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