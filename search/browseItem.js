const url = require('url');
const connectToDatabase = require('../connectToDatabase.js');

function isValidProductID(productID) {
    // Validate product ID format: Capital P followed by 5-digit number (00000 - 99999)
    const regex = /^P\d{5}$/;
    return typeof productID === 'string' && regex.test(productID);
}

function browseItem(request, response) {
    const dBCon = connectToDatabase(); // Assuming connectToDatabase is a function that returns a database connection

    // Extract productID from the request query parameters
    const parsedUrl = url.parse(request.url, true);
    const productID = parsedUrl.query.productID;

    // Validate product ID
    if (!isValidProductID(productID)) {
        const resMsg = {
            code: 400,
            body: "Invalid product ID format"
        };
        response.writeHead(resMsg.code, { "Content-Type": "application/json" });
        response.end(JSON.stringify(resMsg.body));
        return resMsg.body;
    }

    // Construct SQL statement to search products table based on product ID
    const sqlStatement = `
        SELECT nameVar, descriptionVar, manufacturer, price FROM products WHERE productID = ?;
    `;

    // Execute the SQL query
    dBCon.query(sqlStatement, [productID], (error, results) => {
        if (error) {
            console.error("Error executing SQL query:", error);
            const resMsg = {
                code: 500,
                body: "Internal Server Error"
            };
            response.writeHead(resMsg.code, { "Content-Type": "application/json" });
            response.end(JSON.stringify(resMsg.body));
        } else {
            if (results.length > 0) {
                const productDetails = {
                    name: results[0].nameVar,
                    description: results[0].descriptionVar,
                    manufacturer: results[0].manufacturer,
                    price: results[0].price
                };
                const resMsg = {
                    code: 200,
                    body: productDetails
                };
                response.writeHead(resMsg.code, { "Content-Type": "application/json" });
                response.end(JSON.stringify(resMsg.body));

                
            } else {
                const resMsg = {
                    code: 404,
                    body: "Product not found"
                };
                response.writeHead(resMsg.code, { "Content-Type": "application/json" });
                response.end(JSON.stringify(resMsg.body));
            }
        }

        // Close the database connection after sending the response
        dBCon.end();

        return resMsg.body;
    });
}

module.exports = browseItem;