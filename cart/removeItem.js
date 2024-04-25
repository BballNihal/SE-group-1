
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');

/*This function removes an item, this function is complete
POST cart/remove
format:
{
  "ABC":{
   "cartID":"C1234567890",
   "productID":"P1234567890123456"
  }
}
*/
function removeItem(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
          //be careful with deleting not to delete too much
            sqlStatement = "DELETE FROM cart WHERE cartID = '"+ body[i].cartID+ "' AND productID = '"+body[i].productID+"';";
            console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
          console.log("400");
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
            console.log("201");
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
module.exports = removeItem;