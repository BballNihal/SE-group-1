
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
const encrytionID = require('./encrytionID.js');
//const sta = require('../idStandard.js');

/*adds order
POST order/add
(working)
format:
{
   "ABC":{
    "cartID":"C1234567890",
    "paymentInfo":"ABC",
    "discountCode":"2A3B4F",# a 6-digit discount code in hexadecimal
    "price":123.45
    "memberID":"M1234567890123456"
   }
}
*/

function placeOrder(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
        var orderID = 'O'+encrytionID(10, body[0].cartID, body[0].paymentInfo, body[0].discountCode, body[0].price, body[0].memberID);//generate order ID 10 characters long
        // var orderID = sta.order.prefex+encrytionID(sta.order.length, body[0].cartID, body[0].paymentInfo, body[0].discountCode, body[0].price, body[0].memberID); //generate order ID 10 characters long
        for (i in body) {
          if (body[i] instanceof Object) {
            if(verify("discountCode",body[i].discountCode) & verify("cart",body[i].cartID)&verify("string",body[i].paymentInfo)&!isNaN(body[i].price))  {
              sqlStatement = "INSERT INTO orders(cartID, paymentInfo, discountCode, price, orderID, memberID, statusVar)";
              sqlStatement+= "VALUES ('"+body[i].cartID+"','"+body[i].paymentInfo+"','"+body[i].discountCode+"',"+body[i].price+",'"+orderID+"','"+body[i].memberID+"', 'pending');";
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
                  console.log("stver");
              response.writeHead(resMsg.code=400, resMsg.hdrs);
              setHeader(resMsg);
              response.end(resMsg.body);
              dBCon.end();
              }
          }}
    })
}


module.exports = placeOrder;
