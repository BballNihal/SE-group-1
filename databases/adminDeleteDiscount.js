const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();


function adminDeleteDiscount(res,requestData,discountdb){

    discountdb.run(`DELETE FROM discount WHERE productId = ?`, requestData.productId, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Discount Database error: ${err} `);
            return;
        } else {
            res.end(`Discount for ${requestData.productId} sucessfully deleted `);

        }
    }); //end of database delete

    return;
}

module.exports = adminDeleteDiscount;
