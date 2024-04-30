const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');


function adminGetTransaction(res, requestData, transactiondb, writeGet) {
    return new Promise((resolve, reject) => {
        let requiredProperties = ['orderId'];

        if (!(dataValidation(res, requestData, requiredProperties))) {
            return;
        }

        transactiondb.get(`SELECT orderId, productId, deliveryStatus FROM transactions WHERE orderId = ?`, requestData.orderId, function (err, row) {

            if (err) {

                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Database error: ${err}`);
                reject(false);

            } else if (row) {

                if (writeGet) {

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(row));
                }

                resolve(row);

            } else {

                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Transaction not found for orderId ${requestData.orderId}`);
                resolve(false);
            }

        });// end of get database

    });// End of Promise

}//End of function

module.exports = adminGetTransaction;