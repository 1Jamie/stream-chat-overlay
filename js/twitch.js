/*   
    This shit is where the twitch magic happens it's what connects to chat and parses messages as they come barreling along. The chat client connects via a 
    Web Socket to Twitch chat. (not a fan of websockets :p)
    */
var n = 0;
var liveChatID;
var lastYoutubMsg;
var chatArea = document.getElementById("chat");

var messageid = 0;
var chatClient = function chatClient(options) {
    this.username = options.username;
    this.password = options.password;
    this.channel = options.channel;

    this.server = 'irc-ws.chat.twitch.tv';
    this.port = 443;
};

//break it down for the javascript connection to irc barny style
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
        newcnt.appendChild(msgContent);
        newcnt.id = messageid;
        chatArea.appendChild(newcnt);
        console.log(newcnt);
        setTimeout(function () {
            newcnt.remove();
        }, 10000);
        //setTimeout(function(){
        //    deleteMessage();
        //}, 10000);
        messageid++;
    }
    return parsedMessage;
};
