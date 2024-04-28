
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const connectToLiteDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
//const verifyUserStatus = require("../verifyUserStatus.js");


/*adds item to a user's cart
(working) (CHANGED to support memberID validation)
POST cart/add
format:
{
   "ABC":{
    "cartID":"C1234567890",
    "productID":"P1234567890123456",
    "quantity":123
   }
}
*/

function addItem(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;

    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
        console.log("adding");
       
      for (i in body) {
        if (body[i] instanceof Object) {
          if(verify("cart",body[i].cartID) & verify("product",body[i].productID)&verify("quantity",body[i].quantity))  {
          sqlStatement = "INSERT INTO cart(cartID, productID, quantity)";
    sqlStatement+= "VALUES ('"+body[i].cartID+"','"+body[i].productID+"',"+body[i].quantity+");";
            console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
          response.writeHead(resMsg.code=201, resMsg.hdrs); 
        }  
        setHeader(resMsg);
        resMsg.body="";
        resMsg.body+="Added successfully"
        response.end(resMsg.body);
        dBCon.end();
        return resMsg.body;
      }); } else {
        response.writeHead(resMsg.code=400, resMsg.hdrs);
        setHeader(resMsg);
        resMsg.body="Improper input"
        response.end(resMsg.body);
        dBCon.end();
      }
        }}
      
    })
}

function addItemLite(request,response) {
  let resMsg = {};
  var dBCon = connectToLiteDatabase();
  var prebody='';
  var sqlStatement;

  request.on('data', function(data){
      prebody+=data;
      body = JSON.parse(prebody);
      console.log("adding");
     
    for (i in body) {
      if (body[i] instanceof Object) {
        if(verify("cart",body[i].cartID) & verify("product",body[i].productID)&verify("quantity",body[i].quantity))  {
        sqlStatement = "INSERT INTO cart(cartID, productID, quantity)";
  sqlStatement+= "VALUES ('"+body[i].cartID+"','"+body[i].productID+"',"+body[i].quantity+");";
          console.log(sqlStatement);
  dBCon.run(sqlStatement, function (err) { 
      if (err) {
        response.writeHead(resMsg.code=400, resMsg.hdrs);
        }else{
        response.writeHead(resMsg.code=201, resMsg.hdrs); 
      }  
      setHeader(resMsg);
      resMsg.body="";
      resMsg.body+="Added successfully"
      response.end(resMsg.body);
      dBCon.close(); 
      return resMsg.body;
    }); } else {
      response.writeHead(resMsg.code=400, resMsg.hdrs);
      setHeader(resMsg);
      resMsg.body="Improper input"
      response.end(resMsg.body);
      dBCon.close(); 
    }
      }}
    
  })
}

class Item {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
  }
module.exports = addItem, addItemLite;
