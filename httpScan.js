
const fs = require('fs');
const jsdom = require("jsdom");
var http = require('http');
var request = require('request');
var HTMLParser = require('node-html-parser');
const PdfParse = require('pdf-parse');
const { JSDOM } = jsdom;
var output = "";
//create a server object:
const hostName = 'localhost';
const port = (process.env.PORT || 8000);
const makeServer = http.createServer(function (req, res) {
  let body = [];
  body = Buffer.concat(body).toString();
    req.setEncoding('utf8');
    const { JSDOM } = jsdom;
      makeServer.setTimeout(100);
      req.on('data', function(chunk) { 
        body = chunk;
        //for blank files
        if (body.toString() <= 1 | body==undefined) {
          res.writeHead(404,"Not Found");
          res.end();        } else {
      var type = (req.headers['content-type']);
if (req.method != "POST") {
  res.writeHead("405","Method Not Allowed")
  res.end();
} else {
      if (type == "application/json") {
        var err=false;
        try {
          JSON.parse(body);
          
      } catch (error) {
        res.writeHead(400, "Bad Request");
        res.end();
          err = true;
      }
      if (!err){res.writeHead(200, "OK");res.end()}
      } else if (type == "text/html") {
         if (HTMLParser.valid(body) == true) {
          res.writeHead(200, "OK");
          res.end();
         }else {
          res.writeHead(400, "Bad Request");
          res.end();
        }
      } else if (type == "text/plain") {
        res.writeHead(200, "OK");
        res.end();
      }else {
        //Print to console and postman body
        output += "415\nSupported Types: Text, JSON, and HTML";
        res.writeHead(415, "Unsupported Media Type");
        res.write(output);
        res.end();
      }
    }
}});

})


makeServer.listen(port,hostName, () => {
  console.log(`Started at ${hostName}:${port}`);
});
module.exports = { makeServer };