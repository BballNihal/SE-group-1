
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const dataValidation = require('./dataValidation.js');
const adminGetDiscount = require('./adminGetDiscount.js');



async function adminDeleteDiscount(res,requestData,discountdb){

    //--data validation --
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
    
    if(!(dataValidation(res,requestData,requiredProperties))){
        return; 
    }

    let writeGet = 0;


    try{

        var row = await  adminGetDiscount(res,requestData,discountdb,writeGet);

        if(requestData.hasOwnProperty('productId')){

            discountdb.run(`DELETE FROM discount WHERE productId = ?`, requestData.productId, function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Discount Database error: ${err} `);
                    return;
                } else if (this.changes === 0){
    
                    res.writeHead(400,{'Content-Type' : 'text/plain'});
                    res.end(`Error : No matching productId in Database :${requestData.productId}`);
                    return;
    
                }else {
                    res.writeHead(400,{'Content-Type' : 'text/plain'});
                    res.end(`Discount : ${row.discountCode} for ${requestData.productId} sucessfully deleted `);
                }
            }); //end of database delete
    
        }// end of if statement
    
        if (requestData.hasOwnProperty('discountCode')){
    
            discountdb.run(`DELETE FROM discount WHERE discountCode = ?`, requestData.discountCode, function (err) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Discount Database error: ${err} `);
                    return;
                } else if (this.changes === 0){
    
                    res.writeHead(400,{'Content-Type' : 'text/plain'});
                    res.end(`Error : No matching discountCode in Database :${requestData.discountCode}`);
                    return;
    
                }else {
                    res.writeHead(400,{'Content-Type' : 'text/plain'});
                    res.end(`Discount ${requestData.discountCode} sucessfully deleted for product ${row.productId}`);
                }
            }); //end of database delete
    
        }//end of if statement

    }catch{

        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error : Deleting discount ${err}`);

    }//end of try catch

    return;
}//end of function

module.exports = adminDeleteDiscount;
