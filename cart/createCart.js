// Description: This file is used to create a cart for a member.
//input memberID
//add cartID to cart table
//output cartID

const encryptionID = require('../encryptionID.js');
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');

function createCart(memberID) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var cartID = encryptionID(10, memberID);
    var sqlStatement = "INSERT INTO cart(cartID, memberID) VALUES ('"+cartID+"','"+memberID+"');";
    console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
            response.writeHead(resMsg.code=400, resMsg.hdrs);
        } else {
            response.writeHead(resMsg.code=201, resMsg.hdrs); 
        }  
        setHeader(resMsg);
        response.end(resMsg.body);
        dBCon.end();
        return cartID;
    });
}

module.exports = createCart;