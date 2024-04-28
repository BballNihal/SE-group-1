const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./passwordHash.js');

function adminGetTransaction(req, res, member, memberdb) {
    const memberID = member.memberID;

    memberdb.get(`SELECT orderId, productId, deliveryStatus FROM transactions WHERE orderId = ?`, [orderId], function(err, row) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Database error: ${err}`);
        } else if (row) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(row));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Transaction not found not found`);
        }
    });
}

module.exports = adminGetTransaction;