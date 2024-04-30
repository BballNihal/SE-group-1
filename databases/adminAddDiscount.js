const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');



function adminAddDiscount(res,requestData,discountdb){
    //data validation 
    const requiredProperties = ['productId', 'discountCode', 'discountAmount'];

    if(!(dataValidation(res,requestData,requiredProperties))){
        return; 
    }
    

    //inserting discounts inot the discount database
    discountdb.run(`INSERT INTO discount VALUES (?,?,?)`, [requestData.productId, requestData.discountCode, requestData.discountAmount], function (err) {

        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Discount Database error: ${err} `);
        } else {
            res.end(`Discount for ${requestData.productId} sucessfully added `);
        }

    });//end of database insert

    return;
}


module.exports = adminAddDiscount;