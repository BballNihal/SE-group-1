/*create an empty cart to a user
//generate cartid by encrytion of member id and current time
POST cart/createCart
format:
{
   "ABC":{
    "memberID":"M1234567890123456",
   }
}
*/

const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const encrytionID = require('./encrytionID.js');

function createCart(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);        
        for (i in body) {
            if (body[i] instanceof Object) {
                //encryption of member id and current time as cart id in 6 digit
                var cartID = encrytionID(body[i].memberID);
                //insert cart id into cart table while all other values are null
                sqlStatement = "INSERT INTO cart(cartID, productID, quantity)";
                sqlStatement+= "VALUES ('"+cartID+"',null,null);";
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
            }
        }
    }
    )
}

module.exports = createCart;