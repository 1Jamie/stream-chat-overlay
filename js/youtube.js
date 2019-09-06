/* youtube conneaciton for chat base setup
    we are going to need to first query for base of "are we streaming right now"
    then if we are "what is our stream Chat ID" which will be returned when we check
    for currently running Streams  
*/
var delAr = [];
var n = 0;
var liveChatID;
var lastYoutubMsg;
var chatArea = document.getElementById("chat");

// this 
function request() {
    return gapi.client.youtube.liveBroadcasts.list({
            "part": "snippet,contentDetails,status",
            "broadcastStatus": "all",
            "broadcastType": "all"
        })
        .then(function (response) {
                // we should get the stuffs here....
                console.log("Response", response);
                window['liveChatID'] = response.result.items[0].snippet.liveChatId;
                console.log(liveChatID);
            },
            function (err) {
                console.error("Execute error", err);
            }
        ).then(function () {
            getmessages();
        });
}

function signin() {
    //lets go and do a full auth before we go and ask for stuf
    return gapi.auth2.getAuthInstance()
        .signIn({
            scope: 'https://www.googleapis.com/auth/youtube.readonly'
        })
        .then(function () {
                console.log("sign-in successful!");
            },
            function (err) {
                console.error("error signing in", err);
            }).then(gapi.auth2.getAuthInstance().isSignedIn.get())
        .then(request);
}
//this is where we are going to take the stream ID and get the messages from youtube
//youtube responds with a json where you are going to find the messages under 
//  reponse.result.items[n].snippet  and the messages will be each item when requested from liveChatMessages.list
//  and the actual text will be found in the textMessageDetails.messageText 
function getmessages() {
    setInterval(function () {
        return gapi.client.youtube.liveChatMessages.list({
                'liveChatId': liveChatID,
                'part': 'id,snippet,authorDetails'
            })
            .then(function (response) {
                console.log(response.result.items[n]);
                while (response.result.items[n] != undefined) {
                    var parsedYmessage = response.result.items[n].snippet.textMessageDetails.messageText;
                    var messageAuthor = response.result.items[n].authorDetails.displayName;
                    var authorImg = response.result.items[n].authorDetails.profileImageUrl;
                    var newcnt = document.createElement("p");
                    var newImg = document.createElement("img");
                    var msgdlt;
                    var newBr = document.createElement("br");
                    newcnt.id = n;
                    newImg.id = n;
                    newImg.setAttribute('class', 'messageImg');
                    var msgContent = document.createTextNode(messageAuthor + ": " + parsedYmessage);
                    newImg.setAttribute('src', authorImg);
                    chatArea.appendChild(newImg);
                    newcnt.appendChild(msgContent);
                    chatArea.appendChild(newcnt);
                    chatArea.appendChild(newBr);
                    delAr.push(n);
                    setTimeout(deleteMsg, 10000);
                    //now we might as well of go ahead and make a request to get this ball rolling
                    n++;

                }

            });
    }, 5000);
}

function start() {
    //does what you think, intializes
    gapi.client.init({
            apiKey: 'AIzaSyBrd2E4vyr0cpdp56kduGgi2Ek-cqc4aAU',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
            clientId: '717620289810-r1nk784nd8rp2rqmag9kd3k5s3ro91gs.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/youtube.readonly'
        }).then(function () {
            //goes and gets us our pretty api's
            return gapi.client.request({
                'path': 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
            });
        }).then(function (response) {
            //this will just tell use we got it :D
            console.log(response.result);
            //.... or that we didnt :.(
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        })
        .then(signin);
 
}

function deleteMsg() {
    document.getElementById(delAr[0]).remove();
    delar.shift();
}

