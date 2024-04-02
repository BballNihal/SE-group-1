/*
The purpose of this code is to generate a member database
and also allow for admins to add, remove, and edit member data within the database
This takes the input of an admin user and outputs it to the database memberData.db
This does input verfication of making sure username, password,phonenumber, and admin status are all following correct guidlines
It is also generates the memberID of a user in order from M0000000000 to M9999999999 
AUTHOR: Henry Sprigle

Implemented password hashing to work with member database 
Implemented Post, Put,and delete methods for discount and transaction database
AUTHOR: Thomas Vu
*/

const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./passwordHash.js');

const adminAddMember = require('./adminAddmember.js');
const adminUpdateMember = require('./adminUpdateMember.js');
const adminDeleteMember = require('./adminDeleteMember.js');


let memberdb = new sqlite3.Database('./memberData.db');
let discountdb = new sqlite3.Database('./discountData.db');
let transactiondb = new sqlite3.Database('./transactionData.db');

let lastMemberID = 0;

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const path = reqUrl.pathname;
    const method = req.method;
    

    //Discount database requests

    let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

    req.on('end', () => {

         try {
             var requestData = JSON.parse(body);
         } catch (error){
             res.writeHead(400, { 'Content-Type': 'text/plain' });
             res.end(`Error parsing: ${error}`);
             return;
         }

        switch (`${method} ${path}`) {

            case 'POST /member':
                lastMemberID = adminAddMember(req, res, requestData, lastMemberID, memberdb);
                break;
            
            case 'PUT /member':
                adminUpdateMember(req, res, requestData, memberdb);
                break;
            
            case 'DELETE /member':
                adminDeleteMember(req, res, requestData, memberdb);
                break;

            case 'POST /discount':
                
                //data validation 
                const requiredDiscountProperties = ['productId', 'discountCode', 'discountAmount'];
                for (let prop of requiredDiscountProperties) {
                    if (!requestData.hasOwnProperty(prop)) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`Missing required property: ${prop}`);
                        return;
                    }
                }

                //checking for empty IDs
                for(let i = 0; i < requiredDiscountProperties.length;i++){
                    let property = requiredDiscountProperties[i];
                    if(requestData[property].length === 0){
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`Error : Missing ${property} `);
                        return;
                    }
                }


                //inserting discounts inot the discount database
                discountdb.run(`INSERT INTO discount VALUES (?,?,?)`, [requestData.productId,requestData.discountCode,requestData.discountAmount], function(err){

                    if(err){
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Discount Database error: ${err} `);
                    }else {
                        res.end(`Discount sucessfully added `);
                    }

                });//end of database insert

                break; //end of case post /discount

            case 'PUT /discount':
                
                //updating discount database
                discountdb.run(`UPDATE discount SET discountCode = ?, discountAmount = ? WHERE productId = ?`, [requestData.discountCode,requestData.discountAmount,requestData.productId], function (err){
                    if(err){
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Discount Database error: ${err} `);
                    } else if (this.changes === 0){
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Discount Database error: No matching productId in database `);
                    }
                    else {
                        res.end(`Discount sucessfully updated `);

                    }

                });//end of database update

                break;//end of case put /discount

            case 'DELETE /discount':

                discountdb.run(`DELETE FROM discount WHERE productId = ?`, requestData.productId,function(err){
                    if(err){
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Discount Database error: ${err} `);
                    }else {
                        res.end(`Discount sucessfully deleted `);

                    }
                }); //end of database delete
                
                break;//end of case delete /discount




            //Transaction Database Request
            case 'POST /transaction':

                //data validation 
                const requiredTransactionProperties = ['orderId','productId', 'deliveryStatus'];
                for (let prop of requiredTransactionProperties) {
                    if (!requestData.hasOwnProperty(prop)) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`Missing required property: ${prop}`);
                        return;
                    }
                }

                //checking for empty IDs
                for (let i = 0; i < requiredTransactionProperties.length; i++) {
                    let property = requiredTransactionProperties[i];
                    if (requestData[property].length === 0) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`Error : Missing ${property} `);
                        return;
                    }
                }

                //inserting transaction into the transaction database
                transactiondb.run(`INSERT INTO transactions VALUES (?,?,?)`, [requestData.orderId, requestData.productId, requestData.deliveryStatus], function (err) {

                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Transaction Database error: ${err} `);
                    } else {
                        res.end(`transaction sucessfully added `);
                    }

                });//end of database insert


                break;//end of case post /transaction

            case 'PUT /transaction':

                //updating transaction database
                transactiondb.run(`UPDATE transactions SET deliveryStatus = ?, productId = ? WHERE orderId = ?`, [requestData.deliveryStatus, requestData.productId, requestData.orderId], function (err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Transaction Database error: ${err} `);
                    } else if (this.changes === 0) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Transaction Database error: No matching orderID in database `);
                    }
                    else {
                        res.end(`Transaction sucessfully updated `);

                    }

                });//end of database update


                break;//end of case put /transaction

            case 'DELETE /transaction':

                transactiondb.run(`DELETE FROM transactions WHERE orderId = ?`, requestData.orderId, function (err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Transaction Database error: ${err} `);
                    } else {
                        res.end(`Transaction sucessfully deleted `);

                    }
                }); //end of database delete

                break;//end of case delete /transaction


        }//end of switch case






    });//end of req(end)

});//end of server



memberdb.serialize(() => {
    // memberdb.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='members'`, (err, row) => {
    //     if (!row) {
            // memberdb.run(`CREATE TABLE members (memberID TEXT, username TEXT, password TEXT,salt TEXT, phoneNumber TEXT, adminStatus INTEGER)`, (err) => {
                memberdb.run(`CREATE TABLE IF NOT EXISTS members (memberID TEXT, username TEXT, password TEXT,salt TEXT, phoneNumber TEXT, adminStatus INTEGER)`, (err) => {

                if (err) {
                    console.error('Failed to create members table:', err);
                    return;
                }
                console.log('Member Table created successfully.');
            });
    //     }
    // });

    memberdb.get(`SELECT memberID FROM members ORDER BY memberID DESC LIMIT 1`, (err, row) => {
        if (row) {
            lastMemberID = parseInt(row.memberID.substring(1));
        }
    });
});


discountdb.run(`CREATE TABLE IF NOT EXISTS discount (productId TEXT, discountCode TEXT, discountAmount TEXT)`, (err) => {
    if (err) {
        console.error('Failed to create discount table:', err);
        return;
    }
    console.log('Discount Table created successfully.');
});

transactiondb.run(`CREATE TABLE IF NOT EXISTS transactions (orderId TEXT,productId TEXT , deliveryStatus TEXT)`, (err) => {
    if(err) {
        console.error('Failed to create transaction table',err);
        return;
    }
    console.log(`transactions Table created successfully`);
});



server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
// clearDatabase(memberdb);
// dDropDatabase(discountdb);
// function clearDatabase(db) {
//   db.serialize(() => {
//     db.run(`DELETE FROM members`, (err) => {
//       if (err) {
//         console.error('Failed to clear table:', err);
//         return;
//       }
//       console.log('Table cleared successfully.');
//       lastMemberID = 0;  // Reset lastMemberID here
//     });
//   });
// }

// function dDropDatabase(db) {
//     db.serialize(() => {
//       db.run(`DROP TABLE discount`, (err) => {
//         if (err) {
//           console.error('Failed to clear table:', err);
//           return;
//         }
//         console.log('Table dropped successfully.');
//       });
//     });
//   }

// memberdb.serialize(() => {
//     memberdb.run(`DROP TABLE members`, (err) => {
//         if (err) {
//             console.error('Failed to clear table:', err);
//             return;
//         }
//         console.log('Table dropped successfully.');
//     });
// });
// discountdb.serialize(() => {
//     discountdb.run(`DROP TABLE discount`, (err) => {
//         if (err) {
//             console.error('Failed to clear table:', err);
//             return;
//         }
//         console.log('Table dropped successfully.');
//     });
// });
// transactiondb.serialize(() => {
//     transactiondb.run(`DROP TABLE transactions`, (err) => {
//         if (err) {
//             console.error('Failed to clear table:', err);
//             return;
//         }
//         console.log('Table dropped successfully.');
//     });
// });
module.exports = server;
