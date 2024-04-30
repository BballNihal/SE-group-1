


const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');

function adminUpdateDiscount(res, requestData, discountdb) {

    //--data validation --

    var requiredProperties = ['productId'];

    if (requestData.hasOwnProperty('discountCode')) {

        requiredProperties.push('discountCode');
    }

    if (requestData.hasOwnProperty('discountAmount')) {

        requiredProperties.push('discountAmount');

    }

    if (!(dataValidation(res, requestData, requiredProperties))) {
        return;
    }

    //updating discount database
    discountdb.run(`UPDATE discount SET discountCode = ?, discountAmount = ? WHERE productId = ?`, [requestData.discountCode, requestData.discountAmount, requestData.productId], function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Discount Database error: ${err} `);
            return;
        } else if (this.changes === 0) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Discount Database error: No matching productId in database `);
            return;
        }
        else {
            res.end(`Discount for ${requestData.productId} sucessfully updated `);
        }

    });//end of database update


    return;
}


module.exports = adminUpdateDiscount;
