
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');


/*adds item to a user's cart
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
        response.end(resMsg.body);
        dBCon.end();
        return resMsg.body;
      }); } else {
        response.writeHead(resMsg.code=400, resMsg.hdrs);
        setHeader(resMsg);
        response.end(resMsg.body);
        dBCon.end();
      }
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
module.exports = addItem;
