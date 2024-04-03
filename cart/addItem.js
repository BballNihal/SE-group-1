
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
<<<<<<< HEAD
const verifyUserStatus = require("../verifyUserStatus.js");


/*adds item to a user's cart
(working) (CHANGED to support memberID validation)
=======
const createCart = require('./createCart.js');

/*adds item to a user's cart
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
POST cart/add
format:
{
   "ABC":{
<<<<<<< HEAD
    "cartID":"C1234567890",
    "memberID":"M1234567890"
=======
    "cartID":"C1234567890", (null if no cart exists)
    "memberID":"M1234567890123456", (null if guest)
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
    "productID":"P1234567890123456",
    "quantity":123
   }
}
*/

function addItem(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
<<<<<<< HEAD
    //extra code

    //end

    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
        console.log("adding");
       
      for (i in body) {
        if (body[i] instanceof Object) {
          if(verify("cart",body[i].cartID) & verify("product",body[i].productID)&verify("quantity",body[i].quantity) & verifyUserStatus("member",body[i].memberID))  {
          sqlStatement = "INSERT INTO cart(cartID, productID, quantity)";
    sqlStatement+= "VALUES ('"+body[i].cartID+"','"+body[i].productID+"',"+body[i].quantity+");";
            console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
          response.writeHead(resMsg.code=201, resMsg.hdrs); 
        }  
        setHeader(resMsg);
        resMsg.body="";
        resMsg.body+="Added successfully"
        response.end(resMsg.body);
        dBCon.end();
        return resMsg.body;
      }); } else {
        response.writeHead(resMsg.code=400, resMsg.hdrs);
        setHeader(resMsg);
        resMsg.body="Improper input"
        response.end(resMsg.body);
        dBCon.end();
      }
        }}
=======
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
        //if cartID is null, create a new cart with memberID
        if (body.cartID == null) {
            body.cartID = createCart(body.memberID);
        }
        for (i in body) {
          if (body[i] instanceof Object) {
            if(verify("cart",body[i].cartID) & verify("product",body[i].productID)&verify("quantity",body[i].quantity))  {
              sqlStatement = "INSERT INTO cart(cartID, productID, quantity)";
              sqlStatement+= "VALUES ('"+body[i].cartID+"','"+body[i].productID+"',"+body[i].quantity+");";
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
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
      
    })
}




function clearCart() {

}
function calculateTotal() {
    total = 0;
    return total;
}
class Item {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
  }
module.exports = addItem;
