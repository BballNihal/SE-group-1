/*get all order ID's belonging to one member
GET order/list
format:
{
   "ABC":{
    "memberID":"M1234567890123456"
   }
}
*/

const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const connectToLiteDatabase = require('../connectToDatabase.js');

function listOrders(request,response) {
      let resMsg = {};
      var dBCon = connectToDatabase();
      var prebody='';
      var sqlStatement;
      request.on('data', function(data){
         prebody+=data;
         body = JSON.parse(prebody);
         for (i in body) {
            if (body[i] instanceof Object) {
               sqlStatement = "SELECT orderID FROM orders WHERE memberID='"+body[i].memberID+"';";
               console.log(sqlStatement);
               dBCon.query(sqlStatement, function (err, result) {
                  if (err) {
                        response.writeHead(resMsg.code=400, resMsg.hdrs);
                  }else{
                        response.writeHead(resMsg.code=200, resMsg.hdrs); 
                  }  
                  setHeader(resMsg);
                  //response.end(JSON.stringify(result));
                  var i =0;
                  var r;
                  resMsg.body = "";
                  while (result[i] != undefined) {
                     console.log(i);
                     console.log(result[i]);
         
                  resMsg.body+=result[i].orderID+"\n";
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

module.exports = listOrders;