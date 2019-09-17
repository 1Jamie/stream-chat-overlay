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

var n = 0;
var liveChatID;

var messageid = 0;
var chatClient = function chatClient(options) {
    this.username = 'charjaa13';
    this.password = 'oauth:fzr7ox5bh74qagnt6aitux9ehpia5w';
    this.channel = 'charja113';

    this.server = 'irc-ws.chat.twitch.tv';
    this.port = 443;
};

chatClient.prototype.open = function open() {
    this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');

    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);
};

chatClient.prototype.onError = function onError(message) {
    //console.log('Error: ' + message);
};

//kinda important to tell it what to do when it gets a message.... would defeat the purpose otherwise
chatClient.prototype.onMessage = function onMessage(message) {
    if (message !== null) {
        var parsed = this.parseMessage(message.data);
        if (parsed !== null) {
            if (parsed.command === "PING") {
                this.webSocket.send("PONG :" + parsed.message);
            }
        }
    }
};

// we should tell it what to do when it does open
chatClient.prototype.onOpen = function onOpen() {
    var socket = this.webSocket;

    if (socket !== null && socket.readyState === 1) {
        console.log('Connecting and authenticating...');

        socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        socket.send('PASS ' + this.password);
        socket.send('NICK ' + this.username);
        socket.send('JOIN ' + this.channel);
    }
};

chatClient.prototype.onClose = function onClose() {
    console.log('Disconnected from the chat server.');
};

chatClient.prototype.close = function close() {
    if (this.webSocket) {
        this.webSocket.close();
    }
};

//start up the parser!!!! define the pieces!!! LOAD THE CANNONS!!!!!
chatClient.prototype.parseMessage = function parseMessage(rawMessage) {
    var parsedMessage = {
        message: null,
        tags: null,
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };
    //then the fun begins.... lets start to fill them! FIRE!!!!!!!
    if (rawMessage[0] === '@') {
        var tagIndex = rawMessage.indexOf(' '),
            userIndex = rawMessage.indexOf(' ', tagIndex + 1),
            commandIndex = rawMessage.indexOf(' ', userIndex + 1),
            channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
            messageIndex = rawMessage.indexOf(':', channelIndex + 1);
        //then we get the juicy stuffs we want :D
        parsedMessage.tags = rawMessage.slice(0, tagIndex);
        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1);
        //parsedMessage.isSub = parsedMessage.tags.indexOf('badges', subscriber + 1);
    } else if (rawMessage.startsWith("PING")) {
        parsedMessage.command = "PING";
        parsedMessage.message = rawMessage.split(":")[1];
    }
        //this is where we are going to write the message to the div
        console.log(parsedMessage.message, parsedMessage.isSub, parsedMessage.tags);
        if ((parsedMessage.username != null) && (parsedMessage.username.includes('tmi.twitch.tv') != true)) {
            var newcnt = document.createElement("p");
            var msgContent = document.createTextNode(parsedMessage.username + ": " + parsedMessage.message);
            io.emit(
                parsedMessage.username + ": " + parsedMessage.message
            );
            console.log(newcnt);
            setTimeout(function () {
                newcnt.remove();
            }, 10000);
            messageid++;
        }
        return parsedMessage;
};


app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    setTimeout(function(){
        window.chatClient.open()}, 2500);
        window.chatClient = new chatClient({
        channel: '#charja113',
        username: 'charja113',
    });
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
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