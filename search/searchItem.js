const url = require('url');
const connectToDatabase = require('../connectToDatabase.js');

function isValidSearchString(searchString) {
    // Validate search string: 2 - 50 characters
    return typeof searchString === 'string' && searchString.length >= 2 && searchString.length <= 50;
}

function isValidMemberID(memberID) {
    // Validate member ID: Capital M followed by 5-digit number (00000 - 99999)
    const regex = /^M\d{5}$/;
    return typeof memberID === 'string' && regex.test(memberID);
}

function searchItem(request, response) {
  let resMsg = {};
  var dBCon = connectToDatabase();
  // Extract query parameters from the request URL
  const parsedUrl = url.parse(request.url, true);
  const query = parsedUrl.query;
  const memberId = query.memberId;

  // Validate member ID
  if (!isValidMemberID(memberId)) {
      resMsg.code = 400;
      resMsg.body = "Invalid member ID format";
      setHeader(resMsg, response);
      response.writeHead(resMsg.code, { "Content-Type": "text/plain" });
      response.end(resMsg.body);
      return resMsg.body;
  }

  // Construct SQL statement to search cart table based on member ID
  const sqlStatement = `
      SELECT productID FROM cart WHERE memberID = ?;
  `;

  // Execute the SQL query
  dBCon.query(sqlStatement, [memberId], (error, results) => {
      if (error) {
          console.error("Error executing SQL query:", error);
          resMsg.code = 500;
          resMsg.body = "Internal Server Error";
      } else {
          const productIDs = results.map(result => result.productID);
          resMsg.code = 200;
          resMsg.body = productIDs; // Directly assign the array of productIDs
         
      }

      // Send response
      response.writeHead(resMsg.code, { "Content-Type": "application/json" });
      response.end(JSON.stringify(resMsg.body)); // Convert the array to JSON string before sending
      // Close the database connection
      dBCon.end();

      return resMsg.body;
  });
}

module.exports = searchItem;