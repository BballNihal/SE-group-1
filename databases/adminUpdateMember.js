const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const stringHash = require('./passwordHash.js');
function adminUpdateMember(req, res, body, memberdb) {
    const member = JSON.parse(body);

    // Validation code
    const requiredProperties = ['memberID', 'username', 'password', 'phoneNumber', 'adminStatus'];
    for (let prop of requiredProperties) {
        if (!member.hasOwnProperty(prop)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Missing required property: ${prop}`);
            return;
        }
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(member.username)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Username must be a valid email');
        return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(member.phoneNumber)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Phone number must be a valid number with 10 to 15 digits');
        return;
    }

    if (![0, 1].includes(member.adminStatus)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Admin status must be 0 (normal) or 1 (admin)');
        return;
    }

    //encrypt password
    hashPass = stringHash(member.password);
    member.password = hashPass[0];
    const memberSalt = hashPass[1];

    memberdb.run(`UPDATE members SET username = ?, password = ?, salt = ?, phoneNumber = ?, adminStatus = ? WHERE memberID = ?`, [member.username, member.password, memberSalt, member.phoneNumber, member.adminStatus, member.memberID], function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error');
        } else {
            res.end(`Member updated successfully. Your member ID is ${member.memberID}`);
        }
    });
}
module.exports = adminUpdateMember;