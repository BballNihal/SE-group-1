const http = require('http');
const url = require ('url');
const { OAuth2Client } = require('google-auth-library');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const { setUsername, clearUser } = require('./globalVar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validatePassword = require('./validatePassword.js');


const client = new OAuth2Client('565011930264-ktu1iofamjrl4tt7eudf2grpmjtb8nmk.apps.googleusercontent.com');
let db = new sqlite3.Database('./memberData.db');




function handleUpdateMemberRequest(req, res, db) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert buffer to string and append to `body`
    });
    req.on('end', () => {
        const member = JSON.parse(body); // Parse the string to JSON
        const memberID = req.url.split('/')[3]; // Extract memberID from the URL path

        // Validate email format
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(member.username)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Username must be a valid email');
            return;
        }

        // Check if the email already exists for another member
        db.get('SELECT COUNT(*) AS count FROM members WHERE username = ? AND memberID != ?', [member.username, memberID], (err, row) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database error');
            } else if (row.count > 0) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Email address already exists');
            } else {
                // Validate password
                if (!validatePassword(member.password)) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Password must be at least 6 characters long and contain at least one number and one capital letter');
                    return;
                }

                // Update member details in the database
                db.run(`UPDATE members SET username = ?, password = ?, phoneNumber = ?, adminStatus = ? WHERE memberID = ?`, 
                    [member.username, member.password, member.phoneNumber, member.adminStatus, memberID], function (err) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Database error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(`Member updated successfully. Your member ID is ${memberID}`);
                    }
                });
            }
        });
    });
}

module.exports = handleUpdateMemberRequest;