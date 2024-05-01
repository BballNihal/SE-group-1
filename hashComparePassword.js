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

async function hashPassword(password) {
    const saltRounds = 10; 
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = hashPassword;
module.exports = comparePassword;