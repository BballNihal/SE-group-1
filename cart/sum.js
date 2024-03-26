//This function is NOT complete
//It should get prices from products, but only of those which match
//those in the cart (with the given cartID).
//GET cart/sum
/*format:
{
   "ABC":{
    "cartID":"C1234567890",
   }
}

*/
function sum(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            sqlStatement = "SELECT * from products WHERE cartID = '"+ body[i].cartID+ "';";
            console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
            var itemList = new Array();
        for (i in result) {
        
        if (result[i] instanceof Object) {
            itemList.push(result[i]);
            resMsg.body+=result[i];
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

module.exports = sum;