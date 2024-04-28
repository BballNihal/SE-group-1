const setHeader = require('../setHeader.js');
const connectToDatabase = require('../connectToDatabase.js');
const connectToLiteDatabase = require('../connectToDatabase.js');
const verify = require('../verify.js');

// /*get all appointments belonging to one member
// GET appointment/view
// format:
// {
//    "ABC":{
//     "memberID":"M1234567890123456"
//    }
// }
// */

function viewAppointment(request,response) {
    let resMsg = {};
    var dBCon = connectToDatabase();
    var prebody='';
    var sqlStatement;
    request.on('data', function(data){
        prebody+=data;
        body = JSON.parse(prebody);
        for (i in body) {
            if (body[i] instanceof Object) {
                if(verify("member",body[i].memberID))  {
                    sqlStatement = "SELECT * FROM appointments WHERE memberID='"+body[i].memberID+"';";
                    console.log(sqlStatement);
                    dBCon.query(sqlStatement, function (err, result) {
                        if (err) {
                            console.log("error");
                            response.writeHead(resMsg.code=400, resMsg.hdrs);
                        }else{
                            response.writeHead(resMsg.code=200, resMsg.hdrs); 
                        }  
                        setHeader(resMsg);
                        response.end(JSON.stringify(result));
                        dBCon.end();
                        return resMsg.body;
                    }); 
                } else {
                    response.writeHead(resMsg.code=400, resMsg.hdrs);
                    setHeader(resMsg);
                    response.end(resMsg.body);
                    dBCon.end();
                }
            }
    }
    })
}

module.exports = viewAppointment;