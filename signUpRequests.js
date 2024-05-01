const http = require('http');
const url = require ('url');
const { OAuth2Client } = require('google-auth-library');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const hashPassword = require('./hashComparePassword.js');
const validatePassword = require('./validatePassword.js');

const client = new OAuth2Client('565011930264-ktu1iofamjrl4tt7eudf2grpmjtb8nmk.apps.googleusercontent.com');
let db = new sqlite3.Database('./memberData.db');

function handleSignupRequest(req, res, db) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert buffer to string and append to `body`
    });
    req.on('end', () => {
        const member = JSON.parse(body);

        // Check required properties
        const requiredProperties = ['username', 'password', 'phoneNumber', 'adminStatus'];
        for (let prop of requiredProperties) {
            if (!member.hasOwnProperty(prop)) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(`Missing required property: ${prop}`);
                return;
            }
        }

        // Validate email format
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(member.username)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Username must be a valid email');
            return;
        }

        // Validate phone number format
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(member.phoneNumber)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Phone number must be a valid number with 10 to 15 digits');
            return;
        }

        // Validate admin status
        if (![0, 1].includes(member.adminStatus)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Admin status must be 0 (normal) or 1 (admin)');
            return;
        }

        // Validate password
        if (!validatePassword(member.password)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Password must be at least 6 characters long and contain at least one number and one capital letter');
            return;
        }

        // Check if the username already exists
        db.get('SELECT COUNT(*) AS count FROM members WHERE username = ?', [member.username], (err, row) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database error');
            } else if (row.count > 0) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Email address already exists');
            } else {
                // If the username is new, proceed to register
                hashPassword(member.password).then(hashedPassword => {
                    lastMemberID++;
                    member.memberID = 'M' + String(lastMemberID).padStart(10, '0');
                    db.run(`INSERT INTO members VALUES (?, ?, ?, ?, ?)`, 
                        [member.memberID, member.username, hashedPassword, member.phoneNumber, member.adminStatus], function (err) {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Database error');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(`Member registered successfully. Your member ID is ${member.memberID}`);
                        }
                    });
                }).catch(err => {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error hashing password');
                });
            }
        });
    });
}


module.exports = handleSignupRequest;