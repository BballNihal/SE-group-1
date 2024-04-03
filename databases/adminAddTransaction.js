


function adminAddTransaction(res,requestData,transactiondb){


    //data validation 
    const requiredTransactionProperties = ['orderId', 'productId', 'deliveryStatus'];
    for (let prop of requiredTransactionProperties) {
        if (!requestData.hasOwnProperty(prop)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Missing required property: ${prop}`);
            return;
        }
    }

    //checking for empty IDs
    for (let i = 0; i < requiredTransactionProperties.length; i++) {
        let property = requiredTransactionProperties[i];
        if (requestData[property].length === 0) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Error : Missing ${property} `);
            return;
        }
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
