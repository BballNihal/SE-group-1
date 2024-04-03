/*get order details belonging to one order
(products ordered, order date, price, payment info)
GET order/details
<<<<<<< HEAD
(unfinished)
=======
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
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
<<<<<<< HEAD
               sqlStatement = "SELECT price,cartID,paymentInfo FROM orders WHERE orderID='"+body[i].orderID+"';";
=======
               sqlStatement = "SELECT * FROM orders WHERE orderID='"+body[i].orderID+"';";
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
               console.log(sqlStatement);
               dBCon.query(sqlStatement, function (err, result) {
                  if (err) {
                        response.writeHead(resMsg.code=400, resMsg.hdrs);
                  }else{
                        response.writeHead(resMsg.code=200, resMsg.hdrs); 
<<<<<<< HEAD
                  }
                  setHeader(resMsg);
                  var i =0;

                  resMsg.body = "";
                  while (result[i] != undefined) {
         
                  resMsg.body+=result[i].cartID+", $"+result[i].price+", payment info:"+result[i].paymentInfo+"\n";
                  i++;
                  }
                  response.end(resMsg.body);
=======
                  }  
                  setHeader(resMsg);
                  response.end(JSON.stringify(result));
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
                  dBCon.end();
                  return resMsg.body;
               });
            }
         }
      }
   )
}

module.exports = listOrderDetails;