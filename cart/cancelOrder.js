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
const c = require('config');
//set order status to cancelled if it is pending
// function cancelOrder(request,response) {
//       let resMsg = {};
//       var dBCon = connectToDatabase();
//       var prebody='';
//       var sqlStatement;
//       request.on('data', function(data){
//          prebody+=data;
//          body = JSON.parse(prebody);
//          for (i in body) {
//             if (body[i] instanceof Object) {
//                sqlStatement = "UPDATE orders SET statusVar ='Canceled' WHERE orderID='"+body[i].orderID+"' AND statusVar ='pending';";
//                console.log(sqlStatement);
//                dBCon.query(sqlStatement, function (err, result) {
//                   if (err) {
//                         response.writeHead(resMsg.code=400, resMsg.hdrs);
//                   }else{
//                         response.writeHead(resMsg.code=201, resMsg.hdrs); 
//                   }  
//                   setHeader(resMsg);
//                   response.end(resMsg.body);
//                   dBCon.end();
//                   return resMsg.body;
//                });
//             }
//          }
//       }
//    )
// }

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
               sqlStatement = "UPDATE orders SET statusVar ='Canceled' WHERE orderID='"+body[i].orderID+"' AND statusVar ='pending';";
               console.log(sqlStatement);
               dBCon.run(sqlStatement, function (err) { 
                   if (err) {
                       response.writeHead(resMsg.code=400, resMsg.hdrs);
                   }else{
                       response.writeHead(resMsg.code=201, resMsg.hdrs); 
                   }  
                   setHeader(resMsg);
                   response.end(resMsg.body);
                   dBCon.close(); 
                   return resMsg.body;
               });
           }
       }
   })
}

module.exports = cancelOrder;