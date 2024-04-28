
function setHeader(resMsg){
    if (!resMsg.headers || resMsg.headers === null) {
        resMsg.headers = {};
      }
      if (!resMsg.headers["Content-Type"]) {
        resMsg.headers["Content-Type"] = "application/json";
      }
  
  }
const connectToDatabase = require('../connectToDatabase.js');
const connectToLiteDatabase = require('../connectToDatabase.js');

/*updates the quantity of a user's item
POST cart/update
format:
{
   "ABC":{
    "cartID":"C1234567890",
    "productID":"P1234567890123456",
    "quantity":123
   }
}
*/
function update(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            sqlStatement = "UPDATE cart SET quantity = "+
            body[i].quantity+" WHERE cartID = '"+ body[i].cartID+ "' AND productID = '"+body[i].productID+"';";
            console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
          response.writeHead(resMsg.code=201, resMsg.hdrs); 
        }  
        setHeader(resMsg);
        response.end(resMsg.body);
        dBCon.end();
        return resMsg.body;
      });
        }}
    })
}

function clearCart() {

}
function calculateTotal() {
    total = 0;
    return total;
}
class Item {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
  }
module.exports = update;