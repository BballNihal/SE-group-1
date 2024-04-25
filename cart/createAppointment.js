
const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');
const encrytionID = require('./encrytionID.js');
//const sta = require('../idStandard.js');
/*creates member appointment
(working)
POST appointment/add
format:
{
   "ABC":{
    "memberID":"M1234567890123456",
    "time":"YYYYMMDDTHHMMSS",
    "specification":"[(‘Scheduled’, ‘Canceled’, ‘Finished’)]"
   }
}
*/

function createAppointment(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
      for (i in body) {
        if (body[i] instanceof Object) {
            if(verify("member",body[i].memberID) & verify("date",body[i].time) &verify("specification",body[i].specification))  {
              let appointmentID = "A"+ encrytionID(6, body[i].memberID, body[i].time, body[i].specification);
              // let appointmentID = sta.appointment.prefex+encrytionID(sta.appointment.length, body[i].memberID, body[i].time, body[i].specification);
              sqlStatement = "INSERT INTO appointments(memberID, appointmentTime, specification, appointmentID)";
              sqlStatement+= "VALUES ('"+body[i].memberID+"','"+body[i].time+"','"+body[i].specification+"','"+appointmentID+"');";
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
              }); 
          } else {
            response.writeHead(resMsg.code=400, resMsg.hdrs);
            setHeader(resMsg);
            response.end(resMsg.body);
            dBCon.end();
          }
        }}
    })
}

module.exports = createAppointment;
