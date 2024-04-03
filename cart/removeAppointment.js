
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');

/*removes appointment (sets specification to cancelled)
//currently works by time and memberID, could
//be changed to work by appointment ID
(working)
POST appointment/cancel
format:
{
   "ABC":{
    "memberID":"M1234567890123456",
    "time":"YYYYMMDDTHHMMSS"
}
}
*/

function removeAppointment(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            if(verify("member",body[i].memberID) & verify("date",body[i].time))  {
        
            sqlStatement = "UPDATE appointments SET specification = 'Canceled' WHERE memberID ='"+body[i].memberID+"';";
     console.log(sqlStatement);
    dBCon.query(sqlStatement, function (err, result) {
        if (err) {
            console.log("error");
          response.writeHead(resMsg.code=400, resMsg.hdrs);
          }else{
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

module.exports = removeAppointment;