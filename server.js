/*
The purpose of this code is to generate a member database
and also allow for admins to add, remove, and edit member data within the database
This takes the input of an admin user and outputs it to the database memberData.db
This does input verfication of making sure username, password,phonenumber, and admin status are all following correct guidlines
It is also generates the memberID of a user in order from M0000000000 to M9999999999 
AUTHOR: Henry Sprigle

Implemented password hashing to work with member database 
Implemented Post, Put,and delete methods for discount and transaction database
AUTHOR: Thomas Vu Yum Powder

Made Post, Put, Delete, and Get methods for product database compatible with code structure
Took the code from subgroup 3 and made compatible with existing database code from subgroup 1
AUTHOR: Nihal Abdul Muneer
*/

const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./databases/passwordHash.js');

const adminAddMember = require('./databases/adminAddmember.js');
const adminUpdateMember = require('./databases/adminUpdateMember.js');
const adminDeleteMember = require('./databases/adminDeleteMember.js');
const adminGetMember = require('./databases/adminGetMember.js');

const adminAddDiscount = require('./databases/adminAddDiscount.js');
const adminUpdateDiscount = require('./databases/adminUpdateDiscount.js');
const adminDeleteDiscount = require('./databases/adminDeleteDiscount.js');

const adminAddTransaction = require('./databases/adminAddTransaction.js');
const adminUpdateTransaction = require('./databases/adminUpdateTransaction.js');
const adminDeleteTransction = require ('./databases/adminDeleteTransaction.js');

const {getProducts} = require('./databases/getProducts.js');
const {updateProductQuantity} = require('./databases/updateProductQuantity.js');
const {deleteProductFromDatabase} = require('./databases/deleteProductFromDatabase.js');
const {addProductToDatabase} = require('./databases/addProductToDatabase.js');

const ticketController = require('./controllers/ticketController');
const productController = require('./controllers/productController');

require('./models/db');

const querystring = require('querystring');

let memberdb = new sqlite3.Database('./databases/memberData.db');
let discountdb = new sqlite3.Database('./databases/discountData.db');
let transactiondb = new sqlite3.Database('./databases/transactionData.db');

let productdb = new sqlite3.Database('./databases/productDB/products.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the products database.');
});

let lastMemberID = 0;

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const path = reqUrl.pathname;
    const method = req.method;

    const queryParams = reqUrl.query;
    

    //Discount database requests
    
    let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

    req.on('end', () => {

        let data = {};
        try {
            if (body) {
                data = JSON.parse(body);
                requestData = data;
            }
        } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON body." }));
            return;
        }

        //  try {
        //     switch (`${method} ${path}`) {

        //         case 'GET /products':
        //             break;
                
        //         default:
        //             var requestData = JSON.parse(body);
        //             break;
        //     }
            
        //  } catch (error){
        //      res.writeHead(400, { 'Content-Type': 'text/plain' });
        //      res.end(`Error parsing: ${error}`);
        //      return;
        //  }

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

            case 'GET /member':

                adminGetMember(req,res,requestData,memberdb);

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

            case 'GET /transaction':

                adminGetTransaction(req,res,requestData,transactiondb);
                
                break;    

            //Product Database Requests
            case 'GET /products':

                const productIDget = reqUrl.query.productID; // Extract productID from parsed query
                getProducts(req, res, productIDget, productdb);

                break;
            
            case 'POST /products':

                const product = JSON.parse(body);
                addProductToDatabase(productdb, product, res);

                break;
            
            case 'DELETE /products':

                const productIDdel = JSON.parse(body).productID;
                deleteProductFromDatabase(productdb, productIDdel, res);

                break;
                
            case 'PUT /products':

                const { productID, change } = JSON.parse(body);
                updateProductQuantity(productdb, productID, change, res);

                break;

            //Tickets Requests
            case 'POST /tickets/create':

                ticketController.createTicket({ body: data }, res);

                break;

            case 'POST /tickets/reply':

                ticketController.addReplyToTicket(data, res);

                break;
            
            case 'POST /product/reviews/form':

                productController.submitReview({ body: data }, res);

                break;

            case 'DELETE /product/reviews':

                productController.deleteReview({ query: queryParams }, res);

                break;

            case 'POST /product/reviews/edit':

                productController.editReview({ body: data }, res);

                break;
            
            /*====================================================================================================================
            THIS COMMENTED CODE DOES NOT WORK SO I MOVED IT INTO THE DEFAULT CASE (all the cases with path starts with) IF SOMEONE 
            CAN FIGURE IT OUT AND HAVE THE TIME PLEASE DO :)
            ======================================================================================================================*/
            // case 'GET':

            //     if (path.startsWith('/tickets/details/')){
            //         const ticketId = path.split('/')[3];
            //         // Now passing both params and query in the request object
            //         const request = {
            //             params: { ticketId },
            //             query: queryParams // Include parsed query parameters
            //         };
            //         ticketController.getTicketDetails(request, res);
            //     }

            //     break;

            default:

                if (path.startsWith('/tickets/details/') && method === 'GET') {
                    const ticketId = path.split('/')[3];
                    // Now passing both params and query in the request object
                    const request = {
                        params: { ticketId },
                        query: queryParams // Include parsed query parameters
                    };
                    ticketController.getTicketDetails(request, res);
                }
                else if (path.startsWith('/tickets/close/') && method === 'POST') {
                    const ticketId = path.split('/')[3]; // Extracting ticket ID from the URL
                    // Assuming you have a function in your ticketController for closing a ticket
                    ticketController.closeTicket({ params: { ticketId }, body: data }, res);
                }
                else if (path.startsWith('/tickets/open/') && method === 'POST') {
                    const ticketId = path.split('/')[3]; // Extracting ticket ID from the URL
                    // Assuming you have a function in your ticketController for closing a ticket
                    ticketController.openTicket({ params: { ticketId }, body: data }, res);
                }
                else if (path.startsWith('/tickets/faqs') && method === 'GET') {
                    ticketController.getFAQs(req, res);
                }

                //error not found
                else{
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end(`Error: Not Found `);
                }
                

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

productdb.run(`CREATE TABLE IF NOT EXISTS products (productID TEXT,productType TEXT , name TEXT, price Text, quantity INT)`, (err) => {
    if(err) {
        console.error('Failed to create products table',err);
        return;
    }
    console.log(`products Table created successfully`);
});



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//DEV CODE FOR DELETING DB's
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
