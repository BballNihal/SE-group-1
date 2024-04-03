
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');

/*clears a user's cart
(working)
POST cart/clear
format:
{
   "ABC":{
    "cartID":"C1234567890"
   }
}
*/
function clearCart(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            //be careful when deleting, not to delete too much
            sqlStatement = "DELETE FROM cart WHERE cartID = '"+ body[i].cartID+ "';";
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


class Item {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
  }
module.exports = clearCart;