



function adminAddDiscount(res,requestData,discountdb){
    //data validation 
    const requiredDiscountProperties = ['productId', 'discountCode', 'discountAmount'];
    for (let prop of requiredDiscountProperties) {
        if (!requestData.hasOwnProperty(prop)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Missing required property: ${prop}`);
            return;
        }
    }

    //checking for empty IDs
    for (let i = 0; i < requiredDiscountProperties.length; i++) {
        let property = requiredDiscountProperties[i];
        if (requestData[property].length === 0) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Error : Missing ${property} `);
            return;
        }
    }


    //inserting discounts inot the discount database
    discountdb.run(`INSERT INTO discount VALUES (?,?,?)`, [requestData.productId, requestData.discountCode, requestData.discountAmount], function (err) {

        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Discount Database error: ${err} `);
        } else {
            res.end(`Discount ${requestData.discountCode} sucessfully added `);
        }

    });//end of database insert

    return;
}


module.exports = adminAddDiscount;