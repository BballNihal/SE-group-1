/*cancel an order by ID (remove it)
POST order/cancel
format:
{
   "ABC":{
    "orderID":"O1234567890"
   }
}
*/

const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
//set order status to cancelled if it is pending
function cancelOrder(request,response) {
      let resMsg = {};
      var dBCon = connectToDatabase();
      var prebody='';
      var sqlStatement;
      request.on('data', function(data){
         prebody+=data;
         body = JSON.parse(prebody);
         for (i in body) {
            if (body[i] instanceof Object) {
<<<<<<< HEAD
               sqlStatement = "UPDATE orders SET statusVar ='Canceled' WHERE orderID='"+body[i].orderID+"' AND statusVar ='pending';";
=======
               sqlStatement = "UPDATE orders SET status='cancelled' WHERE orderID='"+body[i].orderID+"' AND status='pending';";
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
               console.log(sqlStatement);
               dBCon.query(sqlStatement, function (err, result) {
                  if (err) {
                        response.writeHead(resMsg.code=400, resMsg.hdrs);
                  }else{
                        response.writeHead(resMsg.code=200, resMsg.hdrs); 
                  }  
                  setHeader(resMsg);
                  response.end(resMsg.body);
                  dBCon.end();
                  return resMsg.body;
               });
            }
         }
      }
   )
}
module.exports = cancelOrder;