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

function handleCancelMemberRequest(req, res, db) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert buffer to string and append to `body`
        });
        req.on('end', () => {
            const requestData = JSON.parse(body); // Parse the string to JSON
            const { username, password, memberID } = requestData;

            db.get('SELECT username, password FROM members WHERE memberID = ?', [memberID], (err, row) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database error');
                } else if (row) {
                    if (row.username === username && row.password === password) {
                        // If credentials match, proceed to delete
                        db.run(`DELETE FROM members WHERE memberID = ?`, [memberID], function (err) {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Database error');
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end(`Member deleted successfully. Your member ID was ${memberID}`);
                            }
                        });
                    } else {
                        res.writeHead(401, { 'Content-Type': 'text/plain' });
                        res.end('Unauthorized');
                    }
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Member not found');
                }
            });
        });
    }

module.exports = handleCancelMemberRequest;