const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

function adminDeleteTransaction(res,requestData,transactiondb){

    transactiondb.run(`DELETE FROM transactions WHERE orderId = ?`, requestData.orderId, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Transaction Database error: ${err} `);
            return;
        } else {
            res.end(`Transaction ${requestData.orderId} sucessfully deleted `);

        }
    }); //end of database delete

    return;
}

module.exports = adminDeleteTransaction;
