
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');

function adminAddTransaction(res,requestData,transactiondb){

    //--data validation --
    let requiredProperties = ['orderId','productId','deliveryStatus'];

    if(!(dataValidation(res,requestData,requiredProperties))){
        return; 
    }

    //inserting transaction into the transaction database
    transactiondb.run(`INSERT INTO transactions VALUES (?,?,?)`, [requestData.orderId, requestData.productId, requestData.deliveryStatus], function (err) {

        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Transaction Database error: ${err} `);
        } else {
            res.end(`Transaction sucessfully added : ${requestData.orderId} is the order Id `);
        }

    });//end of database insert



    return;
}

module.exports = adminAddTransaction;