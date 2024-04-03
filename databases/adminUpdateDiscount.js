





function adminUpdateDiscount(res,requestData,discountdb){
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
