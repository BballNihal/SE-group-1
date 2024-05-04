const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./passwordHash.js');

function adminGetMember(req, res, member, memberdb) {
    const memberID = member.memberID;

    memberdb.get(`SELECT memberID, username, phoneNumber, adminStatus FROM members WHERE memberID = ?`, [memberID], function(err, row) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Database error: ${err}`);
        } else if (row) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(row));
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Member not found`);
        }
    });
}

module.exports = adminGetMember;
