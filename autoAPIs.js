// web server module, loaded using "require" -- waits for HTTP requests from clients
const http = require("http");
const iCalendar = require('./iCalendar.js');
const dateMaker = require('./dateMaker.js');
const weekendOrHoliday = require('./weekendOrHoliday.js');
const connectToDatabase = require('./connectToDatabase.js');
const addEventSingle = require('./addEventSingle.js');
const cancelSingle = require('./cancelSingle.js');
const lookupSingle = require('./lookupSingle.js');
const addItem = require('./cart/addItem.js');
const removeItem = require('./cart/removeItem.js');
const update = require('./cart/update.js');
const retrieveItems = require('./cart/retrieveItems.js');
const clearCart = require('./cart/clearCart.js');
const sum = require('./cart/sum.js');
const search = require('./search/searchItem.js');
const search = require('./search/browse/browseItem.js');
const querystr = require('querystring');

var sql = require("mysql2");
const { Console } = require("console");

const port = (process.env.PORT || 8000);
connectToDatabase();


const regExpAddToCart = new RegExp('^\/cart\/add.*');
const regExpRemove = new RegExp('^\/cart\/remove.*');
const regExpUpdate = new RegExp('^\/cart\/update.*');
const regExpClear = new RegExp('^\/cart\/clear.*');
const regExpSum = new RegExp('^\/cart\/sum.*');
const regExpRetrieveItems = new RegExp('^\/cart\/items.*');
const regExpSearchItem = new RegExp('^\/search\/search.*');
const regExpBrowseItem = new RegExp('^\/search\/browse\/browse.*');

function setHeader(resMsg){
  if (!resMsg.headers || resMsg.headers === null) {
      resMsg.headers = {};
    }
    if (!resMsg.headers["Content-Type"]) {
      resMsg.headers["Content-Type"] = "application/json";
    }

}
function applicationServer(request, response) {
  let done = false, resMsg = {};
  
  let urlParts = [];
  let segments = request.url.split('/');

  for (i=0, num=segments.length; i<num; i++) {
    if (segments[i] !== "") { 
      urlParts.push(segments[i]);
    }
  }
  //console.log(urlParts);
  
  if(request.method == "GET"){

    
      try {

        if (regExpSearchItem.test(request.url)) { 
          resMsg = searchItem(request, response);
        } 
        else if (regExpBrowseItem.test(request.url)) {
          resMsg = browseItem(request, response);
        }
      }
      catch(ex) { 
          
      }
  }
  else if(request.method == "POST"){
   
   
    try {
      if (regExpAdd.test(request.url)) {
        resMsg = addEventSingle(request, response);
        //console.log("resMsg: "+resMsg);
        done = true;
        
      }
      if (regExpAddToCart.test(request.url)) {
        console.log("adding");
        resMsg = addItem(request, response);
        done = true;
        
      }
      if (regExpRemove.test(request.url)) {
        console.log("removing");
        resMsg = removeItem(request, response);
        done = true;
        
      }
      if (regExpUpdate.test(request.url)) {
        resMsg = update(request, response);
        done = true;
        
      }
      if (regExpClear.test(request.url)) {
        resMsg = clearCart(request, response);
        done = true;
        
      }
      if (regExpSum.test(request.url)) {
        resMsg = sum(request, response);
        done = true;
        
      }
      if (regExpRetrieveItems.test(request.url)) {
        console.log("trs");
        resMsg = retrieveItems(request, response);
        done = true;
        
      }
       
      }
      catch(ex) { 
      }
  }

  if(done == false) {
    resMsg.code = 404;
    resMsg.body = "Not Found";
    setHeader(resMsg)
    response.writeHead(404, resMsg.hdrs),
    response.end(resMsg.body);
  }

}

const webServer = http.createServer(applicationServer);
webServer.listen(port);

module.exports = applicationServer;