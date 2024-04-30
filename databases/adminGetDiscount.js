const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');

function adminGetDiscount(res, requestData, discountdb, writeGet) {
    return new Promise((resolve, reject) => {


        let requiredProperties = [];

        if(requestData.hasOwnProperty('productId') && requestData.hasOwnProperty('discountCode')){

            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Error : only provide either productId or discountCode `);
            return;
            
        }else if (requestData.hasOwnProperty('productId')){
    
            requiredProperties.push('productId');
    
        }else if (requestData.hasOwnProperty('discountCode')){
    
            requiredProperties.push('discountCode');
    
        }


        if (!(dataValidation(res, requestData, requiredProperties))) {
            
            return;
        }


        if(requestData.hasOwnProperty('productId')){
            discountdb.get(`SELECT productId,discountCode, discountAmount FROM discount WHERE productId = ?`, requestData.productId, function (err, row) {

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
                    res.end(`No discount found for productId ${requestData.productId}`);
                    resolve(false);
                }
    
            });// end of get database
        }

        if (requestData.hasOwnProperty('discountCode')){
            discountdb.get(`SELECT discountCode,productId, discountAmount FROM discount WHERE discountCode = ?`, requestData.discountCode, function (err, row) {

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
                    res.end(`No product attached to discount code :  ${requestData.discountCode}`);
                    resolve(false);
                }
    
            });// end of get database

        }
    });// End of Promise

}//End of function






module.exports = adminGetDiscount;