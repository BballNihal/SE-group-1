const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
//This function is NOT complete
//It should get all products corresponding to a cartID
/* GET cart/items
format:
{
   "ABC":{
    "cartID":"C1234567890"
   }
}
*/
function retrieveItems(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            sqlStatement = "SELECT price from products WHERE cartID = '"+ body[i].cartID+ "';";
            console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
            var itemList = new Array();
        for (i in result) {
        
        if (result[i] instanceof Object) {
            itemList.push(result[i].productID);
            resMsg.body+=result[i].productID+"\n";
        }}
          response.writeHead(resMsg.code=201, resMsg.hdrs); 
          
        }  
        setHeader(resMsg);
        response.end(resMsg.body);
        dBCon.end();
        return itemList;
      });
        }}
    })
}

module.exports = retrieveItems;