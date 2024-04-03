
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
const searchFunction = require('../searchFunction.js');
/* searches products based on a search string
(incomplete)
GET search
format:
{
   "ABC":{
    "search":"ABCDE"[5-20 chars (currently)],
}
}
*/

function search(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            if(2==2) {
                sqlStatement = ""
<<<<<<< HEAD
            sqlStatement = "SELECT nameVar, productType, price FROM products;";
=======
            sqlStatement = "SELECT nameVar, descriptionVar,manufacturer FROM products;";
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
     console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
            console.log("error");
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
            //Change this
            resMsg.body = searchFunction(body[i].search,result);
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

module.exports = search;