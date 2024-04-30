
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');
const adminGetTransaction = require('./adminGetTransaction.js');

async function adminDeleteTransaction(res, requestData, transactiondb) {

    //--data validation --
    let requiredProperties = ['orderId'];

    if (!(dataValidation(res, requestData, requiredProperties))) {
        return;
    }
    let writeGet = 0;

    try {

        var row = await adminGetTransaction(res, requestData, transactiondb, writeGet);

        transactiondb.run(`DELETE FROM transactions WHERE orderId = ?`, requestData.orderId, function (err) {
            if (err) {

                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Transaction Database error: ${err} `);
                return;

            } else if (this.changes === 0) {

                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(`Error : No matching orderId in Database :${requestData.orderId}`);
                return;

            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Transaction ${requestData.orderId} sucessfully deleted for productid ${row.productId}`);

            }
        }); //end of database delete


    } catch (err) {

        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error : Deleting Transaction ${err}`);


    }// End of try catch


    return;
}//End of function

module.exports = adminDeleteTransaction;