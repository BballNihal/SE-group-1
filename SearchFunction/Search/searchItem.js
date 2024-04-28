const url = require('url');
const mysql = require('mysql2');
const sql3 = require('sqlite3').verbose();

function isValidSearchString(searchString) {
    // Validate search string: 2 - 50 characters
    console.log(searchString);
    return typeof searchString === 'string' && searchString.length >= 2 && searchString.length <= 50;
}

function isValidMemberID(memberID) {
    // Validate member ID: Capital M followed by 5-digit number (00000 - 99999)
    const regex = /^M\d{10}$/;
    return typeof memberID === 'string' && regex.test(memberID);
}

function searchItem(request, response) {
    let resMsg = {};
    let dBCon = mysql.createConnection({ // Create a new database connection
        host: 'localhost',
        user: 'root',
        database: 'SHOP',
        password: 'sql65536!#HYUJ'
    });

    // Extract query parameters from the request URL
    const parsedUrl = url.parse(request.url, true);
    console.log(parsedUrl);
    const query = parsedUrl.query;
    console.log(parsedUrl.pathname.substring(8,));
    const memberId = "M1234567890";//query.memberId;
    console.log(memberId);
    const searchString = parsedUrl.pathname.substring(8,);//query.searchString;
    console.log(searchString);
    const productId = query.productId; // Assuming productIds is an array of product IDs

    // Validate search string and member ID
    if (!isValidSearchString(searchString) || !isValidMemberID(memberId)) {
        resMsg.code = 400;
        resMsg.body = "Invalid search string or member ID format";
        response.writeHead(resMsg.code, { "Content-Type": "text/plain" });
        response.end(resMsg.body);
        return;
    }
    console.log("valid");
    // Check if member exists and is active
          
         
                    // Construct SQL statement based on the search parameters
                    let sqlStatement = "SELECT * FROM products WHERE nameVar LIKE '%"+searchString+"%';";
                    console.log(sqlStatement);
                    const params = [/*memberId, */'%${searchString}%']; // Using `%` for wildcard search with LIKE operator
                    console.log(sqlStatement);
                    // If specific product IDs are provided, add them to the query
                    /*if (productIds && productIds.length > 0) {
                        sqlStatement += " product_id IN (?)"; // Assuming productIds is an array of product IDs
                        params.push(productIds);
                    }*/
                    console.log(sqlStatement);
                    // Execute the SQL query
                    dBCon.query(sqlStatement,/* params,*/ (error, results) => {
                        if (error) {
                            console.error("Error executing SQL query:", error);
                            resMsg.code = 500;
                            resMsg.body = "Internal Server Error";
                        } else {
                            resMsg.code = 200;
                            resMsg.body = JSON.stringify(results); // Assuming products are retrieved from the database
                        }

                        // Send response
                        response.writeHead(resMsg.code, { "Content-Type": "application/json" });
                        response.end(resMsg.body);
                        return resMsg;
                    });
                
            

            // Close the database connection
            dBCon.end();
        
}

module.exports = searchItem;
/*
// Check if member exists and is active
    dBCon.query(
        'SELECT * FROM Membership WHERE MemberID = ? AND IsActive = TRUE',
        [memberId],
        (error, results) => {
            if (error) {
                console.error("Error executing SQL query:", error);
                resMsg.code = 500;
                resMsg.body = "Internal Server Error";
                response.writeHead(resMsg.code, { "Content-Type": "text/plain" });
                response.end(resMsg.body);
            } else {
                if (results.length === 0) {
                    // Member does not exist or is not active
                    resMsg.code = 404;
                    resMsg.body = "Member does not exist or is not active";
                    response.writeHead(resMsg.code, { "Content-Type": "text/plain" });
                    response.end(resMsg.body);
                } else {
                    // Construct SQL statement based on the search parameters
                    let sqlStatement = "SELECT * FROM products WHERE member_id = ?";
                    const params = [memberId, `%${searchString}%`]; // Using `%` for wildcard search with LIKE operator

                    // If specific product IDs are provided, add them to the query
                    if (productIds && productIds.length > 0) {
                        sqlStatement += " AND product_id IN (?)"; // Assuming productIds is an array of product IDs
                        params.push(productIds);
                    }

                    // Execute the SQL query
                    dBCon.query(sqlStatement, params, (error, results) => {
                        if (error) {
                            console.error("Error executing SQL query:", error);
                            resMsg.code = 500;
                            resMsg.body = "Internal Server Error";
                        } else {
                            resMsg.code = 200;
                            resMsg.body = JSON.stringify(results); // Assuming products are retrieved from the database
                        }

                        // Send response
                        response.writeHead(resMsg.code, { "Content-Type": "application/json" });
                        response.end(resMsg.body);
                        return resMsg;
                    });
                }
            }

            // Close the database connection
            dBCon.end();
        }
    );
}

module.exports = searchItem;
*/