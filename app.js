var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile('/home/jamie/StreamChatOverlay/index.html');
    res.sendFile('/home/jamie/StreamChatOverlay/public/twitch.js');
    res.sendFile('/home/jamie/StreamChatOverlay/public/youtube.js');
});
app.use(express.static('public'))

var listener = app.listen(80, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 80
});
//test2
