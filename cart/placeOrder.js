
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');


/*adds order
POST order/add
(unfinished)
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
        //generate order id by encrytion of cart id and current time
        var orderID = encrytionID(8,body.cartID);
        for (i in body) {
          if (body[i] instanceof Object) {
            if(verify("discountCode",body[i].discountCode) & verify("cart",body[i].cartID)&verify("string",body[i].paymentInfo)&!isNaN(body[i].price))  {
              sqlStatement = "INSERT INTO orders(cartID, paymentInfo, discountCode, price, orderID, memberID, status)";
              sqlStatement+= "VALUES ('"+body[i].cartID+"','"+body[i].paymentInfo+"','"+body[i].discountCode+"',"+body[i].price+","+orderID+","+body[i].memberID+", 'pending');";
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


module.exports = placeOrder;
