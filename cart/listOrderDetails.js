/*get order details belonging to one order
(price, cart ID, payment info)
GET order/details

format:
{
   "ABC":{
    "orderID":"M1234567890123456"
   }
}
*/
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const connectToLiteDatabase = require('../connectToDatabase.js');
function listOrderDetails(request,response) {
      let resMsg = {};
      var dBCon = connectToDatabase();
      var prebody='';
      var sqlStatement;
      request.on('data', function(data){
         prebody+=data;
         body = JSON.parse(prebody);
         for (i in body) {
            if (body[i] instanceof Object) {
               sqlStatement = "SELECT price,cartID,paymentInfo FROM orders WHERE orderID='"+body[i].orderID+"';";
               console.log(sqlStatement);
               dBCon.query(sqlStatement, function (err, result) {
                  if (err) {
                        response.writeHead(resMsg.code=400, resMsg.hdrs);
                  }else{
                        response.writeHead(resMsg.code=200, resMsg.hdrs); 
                  }
                  setHeader(resMsg);
                  var i =0;

                  resMsg.body = "";
                  while (result[i] != undefined) {
         
                  resMsg.body+=result[i].cartID+", $"+result[i].price+", payment info:"+result[i].paymentInfo+"\n";
                  i++;
                  }
                  response.end(resMsg.body);
                  dBCon.end();
                  return resMsg.body;
               });
            }
         }
      }
   )
}

module.exports = listOrderDetails;