const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./passwordHash.js');

function adminDeleteMember(req, res, member, memberdb) {
  
    if (!member.hasOwnProperty('memberID')) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Missing required property: memberID`);
        return;
    }

    const memberID = member.memberID;

    const memberIDRegex = /^M\d{10}$/;
    if (!memberIDRegex.test(member.memberID)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid MemberID');
        return;
    }

    memberdb.run(`DELETE FROM members WHERE memberID = ?`, member.memberID, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error');
        } else {
            res.end(`Member deleted successfully. Your member ID was ${member.memberID}`);
        }
    });
}
module.exports = adminDeleteMember;
