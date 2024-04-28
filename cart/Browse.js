
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const connectToLiteDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
const searchFunction = require('../searchFunction.js');
/*browse description of one product 
GET search/browse (GET browse)
format:
{
   "ABC":{
    "productID":"P1234567890123456"
}
}
*/
const url = require('url');
function isValidProductID(productID) {
    // Validate product ID format: Capital P followed by 16-digit number
    const regex = /^P\d{16}$/;
    return true;//typeof productID === 'string' && regex.test(productID);
}

function Browse(request, response) {
    const dBCon = connectToDatabase(); // Assuming connectToDatabase is a function that returns a database connection
    
    // Extract productID from the request query parameters
    const parsedUrl = url.parse(request.url, true);
   // console.log(parsedUrl);
    const productID = parsedUrl.pathname.substring(8,);//parsedUrl.query.productID;
 // console.log("b2"+productID);

    // Validate product ID
    if (!isValidProductID(productID)) {
        const resMsg = {
            code: 400,
            body: "Invalid product ID format"
        };
        response.writeHead(resMsg.code, { "Content-Type": "application/json" });
        response.end(JSON.stringify(resMsg.body));
        return;
    }
    // Construct SQL statement to search products table based on product ID
    const sqlStatement = `
        SELECT nameVar, productType, price FROM products WHERE productID = '`+productID+"';";

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
                var details = "name: ";
                /*const productDetails = {
                    name: results[0].nameVar,
                    description: results[0].descriptionVar,
                    manufacturer: results[0].manufacturer,
                    price: results[0].price
                };*/
                const resMsg = {
                  code: 400,
                  body: results[0].nameVar
              };
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(resMsg.body);

                
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

module.exports = Browse;

/*
function browse(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            if(verify("product",body[i].productID)) {
            sqlStatement = "SELECT descriptionVar FROM products WHERE productID = '"+body[i].productID+"';";
     console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
            console.log("error");
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
            resMsg.body = result[0].descriptionVar;
          response.writeHead(resMsg.code=201, resMsg.hdrs); 
        }  
        setHeader(resMsg);
        response.end(resMsg.body);
        dBCon.end();
        return resMsg.body;
      }); } else {
        response.writeHead(resMsg.code=400, resMsg.hdrs);
        setHeader(resMsg);
        response.end(resMsg.body);
        dBCon.end();
      }
        }}
    })
}

module.exports = browse;*/