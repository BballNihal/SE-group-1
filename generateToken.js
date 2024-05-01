const http = require('http');
const url = require ('url');
const { OAuth2Client } = require('google-auth-library');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const { setUsername, clearUser } = require('./globalVar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const client = new OAuth2Client('565011930264-ktu1iofamjrl4tt7eudf2grpmjtb8nmk.apps.googleusercontent.com');
let db = new sqlite3.Database('./memberData.db');

function generateToken(username) {
    const randomKey = generateRandomKey();

    const token = jwt.sign({ username: username, randomKey: randomKey }, 'secret_key', { expiresIn: '1h' });
    console.log('Generated Token:', token); 
    return token;
}

function generateRandomKey() {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const randomKey = randomNumber.toString().padStart(6, '0');
    return randomKey;
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (err, authData) => {
            if (err) {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('Forbidden');
            } else {
                // Token is verified
                req.authData = authData;
                next();
            }
        });
    } else {
        // Token not provided
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
    }
}

module.exports = verifyToken;
module.exports = generateRandomKey;
module.exports = generateToken; 