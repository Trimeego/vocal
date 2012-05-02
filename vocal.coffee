http = require("http")
express = require("express")
app = express.createServer()
tropo_webapi = require("tropo-webapi")
app.configure ->
  app.use express.methodOverride()
  app.use express.bodyParser()
  app.use app.router
  app.use express.static(__dirname + "/public")

app.post "/", (req, res) ->
  tropo = new TropoWebAPI()
  tropo.say "Welcome to the Supplier Portal."
  tropo.on "continue", null, "/query", true
  res.send TropoJSON(tropo)


app.post "/query", (req, res) ->
  tropo = new TropoWebAPI()
  say = new Say("How can I help you?")
  choices = new Choices("http://vocal.labs.icggroupinc.com/vocal.grxml")
  tropo.ask choices, null, null, null, "query", null, null, say, 60, null
  tropo.on "continue", null, "/continue", true
  res.send TropoJSON(tropo)

app.post "/continue", (req, res) ->
  tropo = new TropoWebAPI()
  console.log req.body
  error = req.body["result"]["error"]
  if error
    tropo.say "Error, " + error
    res.send TropoJSON(tropo)
  else
    query = req.body["result"]["actions"]["value"] ? {}
    console.log req.body["result"]["actions"]

    query.docType ?= 'invoice'
    query.docStatus ?= 'unpaid'

    if query.condition && query.condition.field && query.condition.operator && query.condition.value
      phrases = ["I am searching for "]

      switch query.docType
        when "invoice"
          if query.condition.operator is "is"
            phrases.push "a #{query.docStatus} invoice number #{query.condition.value}"
            phrases.push query.condition.value
          else
            if query.condition.field is "invoice_date"
              if query.condition.operator is "isGreaterThan"
                phrases.push "#{query.docStatus} invoices dated after  #{query.condition.value}"
              else
                phrases.push "#{query.docStatus} invoices dated before #{query.condition.value}"
            else if query.condition.field is "check_date"
              if query.condition.operator is "isGreaterThan"
                phrases.push "#{query.docStatus} invoices paid after #{query.condition.value}"
              else
                phrases.push "#{query.docStatus} invoices paid before #{query.condition.value}"
            else
              if query.condition.operator is "isGreaterThan"
                phrases.push "#{query.docStatus} invoices over  #{query.condition.value}"
              else
                phrases.push "#{query.docStatus} invoices over  #{query.condition.value}"

        when "po"
          phrases.push "#{query.docStatus} invoices for purchase order #{query.condition.value}"
      
      tropo.say phrases.join(' ')
      tropo.on "continue", null, "/answer", true
      res.send TropoJSON(tropo)

    else
      tropo.say "I'm sorry I didn't get that"
      tropo.on "continue", null, "/query", true
      res.send TropoJSON(tropo)

app.post "/answer", (req, res) ->
  tropo = new TropoWebAPI()
  setTimeout (->
    tropo.say "I found two invoices that matched your inquiry.  Would you like me e-mail the results to you?"
    res.send TropoJSON(tropo)
  ), 2000

app.listen 8081
console.log "Server running on port :8081"