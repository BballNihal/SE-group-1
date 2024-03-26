/*get order details belonging to one order
(products ordered, order date, price, payment info)
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
               sqlStatement = "SELECT * FROM orders WHERE orderID='"+body[i].orderID+"';";
               console.log(sqlStatement);
               dBCon.query(sqlStatement, function (err, result) {
                  if (err) {
                        response.writeHead(resMsg.code=400, resMsg.hdrs);
                  }else{
                        response.writeHead(resMsg.code=200, resMsg.hdrs); 
                  }  
                  setHeader(resMsg);
                  response.end(JSON.stringify(result));
                  dBCon.end();
                  return resMsg.body;
               });
            }
         }
      }
   )
}

module.exports = listOrderDetails;