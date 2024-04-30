
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');

function adminUpdateTransaction(res, requestData, transactiondb) {

    //--data validation --
    
    var requiredProperties = ['orderId'];

    if(requestData.hasOwnProperty('deliveryStatus')){

        requiredProperties.push('deliveryStatus');
    }

    if (requestData.hasOwnProperty('productId')) {

        requiredProperties.push('productId');

    }

    if(!(dataValidation(res,requestData,requiredProperties))){
        return; 
    }


    //updating transaction database
    transactiondb.run(`UPDATE transactions SET deliveryStatus = ?, productId = ? WHERE orderId = ?`, [requestData.deliveryStatus, requestData.productId, requestData.orderId], function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Transaction Database error: ${err} `);
            return;
        } else if (this.changes === 0) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Transaction Database error: No matching orderID in database `);
            return;
        }else {

            res.writeHead(200,{'Content-Type' : 'text/plain'});
            res.end(`Transaction ${requestData.orderId} sucessfully updated `);
        }

    });//end of database update

    return;
}//End of function
module.exports = adminUpdateTransaction;
