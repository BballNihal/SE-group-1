const http = require('http');
const url = require ('url');
const { OAuth2Client } = require('google-auth-library');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const comparePassword = require('./hashComparePassword.js');
const{verifyToken, generateToken, generatRandomKey}= require('generateToken.js');


const client = new OAuth2Client('565011930264-ktu1iofamjrl4tt7eudf2grpmjtb8nmk.apps.googleusercontent.com');
let db = new sqlite3.Database('./memberData.db');

function handleLoginRequest(req, res, db) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert buffer to string and append to `body`
    });
    req.on('end', () => {
        const loginData = JSON.parse(body);
        const { username, password } = loginData;

        // Retrieve user from database
        db.get('SELECT * FROM members WHERE username = ?', [username], (err, row) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database error');
            } else if (row) {
                // Compare hashed password
                comparePassword(password, row.password).then(match => {
                    if (match) {
                        // Passwords match, proceed with login
                        const token = generateToken(username);
                        res.writeHead(200, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
                        res.end(JSON.stringify({ message: 'Login successful', token: token }));
                    } else {
                        // Passwords don't match
                        res.writeHead(401, { 'Content-Type': 'text/plain' });
                        res.end('Invalid username or password');
                    }
                }).catch(err => {
                    console.error('Error comparing passwords:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error comparing passwords');
                });
            } else {
                // No user found with the provided username
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Invalid username or password');
            }
        });
    });
}

module.exports = handleLoginRequest;