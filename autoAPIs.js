// web server module, loaded using "require" -- waits for HTTP requests from clients
const http = require("http");
const config = require('./config.js');
/*const iCalendar = require('./iCalendar.js');
const dateMaker = require('./dateMaker.js');
const weekendOrHoliday = require('./weekendOrHoliday.js');
*/const connectToDatabase = require('./connectToDatabase.js');
//const addEventSingle = require('./addEventSingle.js');
/*const cancelSingle = require('./cancelSingle.js');
const lookupSingle = require('./lookupSingle.js');
*/const addItem = require('./cart/addItem.js');
const removeItem = require('./cart/removeItem.js');
const update = require('./cart/update.js');
//const retrieveItems = require('./cart/retrieveItems.js');
const clearCart = require('./cart/clearCart.js');

const createAppointment = require('./cart/createAppointment.js');
const removeAppointment = require('./cart/removeAppointment.js');
const viewAppointment = require('./cart/viewAppointment.js');
//const search = require('./cart/search.js');
const searchItem = require('./SearchFunction/Search/searchItem.js');
//const sum = require('./cart/sum.js');

//const createCart = require('./cart/createCart.js');

const listOrders = require('./cart/listOrders.js');
const listOrderDetails = require('./cart/listOrderDetails.js');
const placeOrder = require('./cart/placeOrder.js');
const cancelOrder = require('./cart/cancelOrder.js');
const browse = require('./cart/Browse.js');
const querystr = require('querystring');

var sql = require("mysql2");
var sqlite3 = require('sqlite3').verbose();
const { Console } = require("console");

const port = (process.env.PORT || config.server.port);
connectToDatabase();


const regExpAddToCart = new RegExp('^\/cart\/add.*');
const regExpRemove = new RegExp('^\/cart\/remove.*');
const regExpUpdate = new RegExp('^\/cart\/update.*');
const regExpClear = new RegExp('^\/cart\/clear.*');
const regExpSum = new RegExp('^\/cart\/sum.*');

const regExpCreateCart = new RegExp('^\/cart\/createCart.*');

const regExpCreateAppointment = new RegExp('^\/appointment\/add.*');
const regExpRemoveAppointment = new RegExp('^\/appointment\/cancel.*');
const regExpViewAppointment = new RegExp('^\/appointment\/view.*');
const regExpRetrieveItems = new RegExp('^\/cart\/items.*');
const regExpSearch = new RegExp('^\/search.*');

const regExpBrowse = new RegExp('^\/browse.*');
const regExpListOrders = new RegExp('^\/order\/list.*');
const regExpPlaceOrder = new RegExp('^\/order\/add.*');
const regExpListOrderDetails = new RegExp('^\/order\/details.*');
const regExpCancelOrder = new RegExp('^\/order\/cancel.*');
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
        if (regExpSearch.test(request.url)) {
          resMsg = searchItem(request, response);
          done = true;
          
        }
        if (regExpListOrderDetails.test(request.url)) {
          resMsg = listOrderDetails(request, response);
          done = true;
          
        }
        if (regExpListOrders.test(request.url)) {
          console.log("li");
          resMsg = listOrders(request, response);
          done = true;
          
        }
        if (regExpBrowse.test(request.url)) {
          console.log("browsing");
          resMsg = browse(request, response);
          done = true;
          
        }
        if (regExpViewAppointment.test(request.url)) {
          resMsg = viewAppointment(request, response);
          done = true;
          
        }
        if (regExpSum.test(request.url)) {
          console.log("sum");
          resMsg = sum(request, response);
          done = true;
          
        }
        if (regExpRetrieveItems.test(request.url)) {
          resMsg = retrieveItems(request, response);
          done = true;
          
        }
      }
      catch(ex) { 
          
      }
  }
  else if(request.method == "POST"){
   
   
    try {
 
      if (regExpCreateCart.test(request.url)) {
        resMsg = createCart(request, response);
        done = true;
        
      }
      if (regExpAddToCart.test(request.url)) {
        console.log("adding");
        resMsg = addItem(request, response);
        done = true;
        
      }
      if (regExpRemoveAppointment.test(request.url)) {
        resMsg = removeAppointment(request, response);
        done = true;
        
      }
      if (regExpPlaceOrder.test(request.url)) {
        resMsg = placeOrder(request, response);
        done = true;
        
      }
      if (regExpCancelOrder.test(request.url)) {
        resMsg = cancelOrder(request, response);
        done = true;
        
      }
      if (regExpCreateAppointment.test(request.url)) {
        resMsg = createAppointment(request, response);
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