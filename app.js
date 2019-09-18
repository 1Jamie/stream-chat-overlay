const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
var irc = require('irc');
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
    channels: ["#charja113"],
    server: "irc.twitch.tv",
    username: "charja113",
    nick: "charja113",
    password: "oauth:fzr7ox5bh74qagnt6aitux9ehpia5w",
    sasl: true,
    autoConnect: true
};

var bot = new irc.Client(config.server, config.nick, config);

bot.connect();
console.log('bot connected');

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });
    bot.addListener("message", function(from, message) {
        io.emit(from + ':' + message );
        console.log('message seen');
    })
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