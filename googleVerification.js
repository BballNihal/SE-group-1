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

function redirectToGoogleSignIn(req, res) {
    // Construct the Google Sign-In URL with appropriate query parameters
    const redirectUrl = 'https://accounts.google.com/o/oauth2/v2/auth' +
        '?client_id=565011930264-ktu1iofamjrl4tt7eudf2grpmjtb8nmk.apps.googleusercontent.com' +
        '&redirect_uri=http://localhost:3000/auth/google/callback' +
        '&response_type=code' +
        '&scope=email%20profile';

    // Redirect the user to Google's OAuth 2.0 server
    res.writeHead(302, { 'Location': redirectUrl });
    res.end();
}
function verifyGoogle(req, res, db) {
    const reqUrl = url.parse(req.url, true);
    const token = reqUrl.query.token;

    if (token) {
        // Verify the token with Google
        client.verifyIdToken({
            idToken: token,
            audience: '565011930264-ktu1iofamjrl4tt7eudf2grpmjtb8nmk.apps.googleusercontent.com' 
        }).then((ticket) => {
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            const email = payload['email'];  // Assuming you're using the email as the username

            // Check if the user is already in the database
            db.get('SELECT username FROM members WHERE username = ?', [email], (err, row) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database Error');
                } else if (!row) {
                    // Insert new user if not found
                    db.run('INSERT INTO members (username) VALUES (?)', [email], (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Database Error during user insertion');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User registered successfully', username: email }));
                        }
                    });
                } else {
                    // User already exists, maybe update or just log in
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User logged in successfully', username: email }));
                }
            });
        }).catch((error) => {
            console.error('Google token verification failed:', error);
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized - Google token verification failed');
        });
    } else {
        // No token provided, handle error
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request - No token provided');
    }
}

module.exports = verifyGoogle;
module.exports = redirectToGoogleSignIn;