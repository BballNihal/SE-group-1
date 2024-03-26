
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
const searchFunction = require('../searchFunction.js');
/*browse description of one product 
(unfinished)
GET search/browse
format:
{
   "ABC":{
    "productID":"P1234567890123456"
}
}
*/

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

module.exports = browse;