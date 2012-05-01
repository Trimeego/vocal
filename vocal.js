var http = require('http');
var express = require('express');
var app = express.createServer();
var tropo_webapi = require('tropo-webapi');
 
// Required to process the HTTP body.
// req.body has the Object while req.rawBody has the JSON string.
 
app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
});
 
app.post('/', function(req, res){
     
    var tropo = new TropoWebAPI();
     
    var say = new Say("Welcome to the Supplier Portal.  How can I help you?");
    var choices = new Choices("http://vocal.labs.icggroupinc.com/vocal.grxml");
 
    // (choices, attempts, bargein, minConfidence, name, recognizer, required, say, timeout, voice);
     
    tropo.ask(choices, null, null, null, "query", null, null, say, 60, null);
     
    tropo.on("continue", null, "/continue", true);
     
    res.send(TropoJSON(tropo));
     
});
 
app.post('/continue', function(req, res){
     
    var tropo = new TropoWebAPI();
 
    console.log(req.body)

    var answer = req.body['result']['actions']['value'];


    console.log(req.body['result']['actions'])
     
    tropo.say("You said " + answer);
         
    res.send(TropoJSON(tropo));
 
});
 
app.listen(8081);
console.log('Server running on port :8081');