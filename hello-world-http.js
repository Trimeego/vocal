var http = require('http');
var tropowebapi = require('tropo-webapi');

var server = http.createServer(function (request, response) {

  // Create a new instance of the TropoWebAPI object.
  var tropo = new tropowebapi.TropoWebAPI();
  tropo.say("Hello, World!");

  // Render out the JSON for Tropo to consume.
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(tropowebapi.TropoJSON(tropo));

}).listen(8081); // Listen on port 8081 for requests.