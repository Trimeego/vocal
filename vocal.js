// Generated by CoffeeScript 1.3.1
(function() {
  var app, express, http, tropo_webapi;

  http = require("http");

  express = require("express");

  app = express.createServer();

  tropo_webapi = require("tropo-webapi");

  app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    return app.use(express["static"](__dirname + "/public"));
  });

  app.post("/", function(req, res) {
    var tropo;
    tropo = new TropoWebAPI();
    tropo.say("Welcome to the Supplier Portal.");
    tropo.on("continue", null, "/query", true);
    return res.send(TropoJSON(tropo));
  });

  app.post("/query", function(req, res) {
    var choices, say, tropo;
    tropo = new TropoWebAPI();
    say = new Say("How can I help you?");
    choices = new Choices("http://vocal.labs.icggroupinc.com/vocal.grxml");
    tropo.ask(choices, null, null, null, "query", null, null, say, 60, null);
    tropo.on("continue", null, "/continue", true);
    return res.send(TropoJSON(tropo));
  });

  app.post("/continue", function(req, res) {
    var error, phrases, query, tropo;
    tropo = new TropoWebAPI();
    console.log(req.body);
    error = req.body["result"]["error"];
    if (error) {
      tropo.say("Error, " + error);
      return res.send(TropoJSON(tropo));
    } else {
      query = req.body["result"]["actions"]["value"];
      console.log(req.body["result"]["actions"]);
      if (query.docType == null) {
        query.docType = 'invoice';
      }
      if (query.docStatus == null) {
        query.docStatus = 'unpaid';
      }
      if (query.condition && query.condition.field && query.condition.operator && query.condition.value) {
        phrases = ["Are you looking for "];
        switch (query.docType) {
          case "invoice":
            if (query.condition.operator === "is") {
              phrases.push("a " + query.docStatus + " invoice number " + query.condition.value);
              phrases.push(query.condition.value);
            } else {
              if (query.condition.field === "invoice_date") {
                if (query.condition.operator === "isGreaterThan") {
                  phrases.push("" + query.docStatus + " invoices dated after  " + query.condition.value);
                } else {
                  phrases.push("" + query.docStatus + " invoices dated before " + query.condition.value);
                }
              } else if (query.condition.field === "check_date") {
                if (query.condition.operator === "isGreaterThan") {
                  phrases.push("" + query.docStatus + " invoices paid after " + query.condition.value);
                } else {
                  phrases.push("" + query.docStatus + " invoices paid before " + query.condition.value);
                }
              } else {
                if (query.condition.operator === "isGreaterThan") {
                  phrases.push("" + query.docStatus + " invoices over  " + query.condition.value);
                } else {
                  phrases.push("" + query.docStatus + " invoices over  " + query.condition.value);
                }
              }
            }
            break;
          case "po":
            phrases.push("" + query.docStatus + " invoices for purchase order " + query.condition.value);
        }
        tropo.say(phrases.join(' '));
        tropo.on("continue", null, "/answer", true);
        return res.send(TropoJSON(tropo));
      } else {
        tropo.say("I'm sorry I didn't get that");
        tropo.on("continue", null, "/", true);
        return res.send(TropoJSON(tropo));
      }
    }
  });

  app.post("/answer", function(req, res) {
    var tropo;
    tropo = new TropoWebAPI();
    return setTimeout((function() {
      tropo.say("I found two invoices that matched your inquiry.  Would you like me e-mail the results to you?");
      return res.send(TropoJSON(tropo));
    }), 2000);
  });

  app.listen(8081);

  console.log("Server running on port :8081");

}).call(this);
