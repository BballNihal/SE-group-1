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

const adminAddDiscount = require('./adminAddDiscount.js');
const adminUpdateDiscount = require('./adminUpdateDiscount.js');
const adminDeleteDiscount = require('./adminDeleteDiscount.js');

const adminAddTransaction = require('./adminAddTransaction.js');
const adminUpdateTransaction = require('./adminUpdateTransaction.js');
const adminDeleteTransction = require ('./adminDeleteTransaction.js');

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
                
                adminAddDiscount(res,requestData,discountdb);

                break; //end of case post /discount

            case 'PUT /discount':
                
                adminUpdateDiscount(res,requestData,discountdb);

                break;//end of case put /discount

            case 'DELETE /discount':

                adminDeleteDiscount(res,requestData,discountdb);
                
                break;//end of case delete /discount



            //Transaction Database Request
            case 'POST /transaction':

                adminAddTransaction(res,requestData,transactiondb);


                break;//end of case post /transaction

            case 'PUT /transaction':

                adminUpdateTransaction(res,requestData,transactiondb);

                break;//end of case put /transaction

            case 'DELETE /transaction':

                adminDeleteTransction(res,requestData,transactiondb);

                break;//end of case delete /transaction
                
            case 'GET /member':

                adminGetMember(req,res,requestData,memberdb);
                break;
                
            default:

                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Error: Not Found `);

            break;


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
