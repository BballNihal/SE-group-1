const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./passwordHash.js');

function adminDeleteMember(req, res, body, memberdb) {
    const member = JSON.parse(body);
    const memberID = member.memberID;

    memberdb.run(`DELETE FROM members WHERE memberID = ?`, memberID, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error');
        } else {
            res.end(`Member deleted successfully. Your member ID was ${memberID}`);
        }
    });
}
module.exports = adminDeleteMember;