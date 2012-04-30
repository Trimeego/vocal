var http = require('http');
var express = require('express');
var app = express.createServer();
var tropo_webapi = require('tropo-webapi');
 
// Required to process the HTTP body.
// req.body has the Object while req.rawBody has the JSON string.
 
app.configure(function(){
    app.use(express.bodyParser());
});
 
app.post('/', function(req, res){
     
    var tropo = new TropoWebAPI();
     
    var say = new Say("What's your destination?");
    var choices = new Choices("http://myserver.com/destinations.grxml");
 
    // (choices, attempts, bargein, minConfidence, name, recognizer, required, say, timeout, voice);
     
    tropo.ask(choices, null, null, null, "destinations", null, null, say, 60, null);
     
    tropo.on("continue", null, "/continue", true);
     
    res.send(TropoJSON(tropo));
     
});
 
app.post('/continue', function(req, res){
     
    var tropo = new TropoWebAPI();
 
    var answer = req.body['result']['actions']['value'];
     
    tropo.say("You said " + answer);
         
    res.send(TropoJSON(tropo));
 
});
 
app.listen(8000);
console.log('Server running on port :8000');