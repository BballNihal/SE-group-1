var sql = require("mysql2");
const config = require('./config.js');

function connectToDatabase() {
    var connection = sql.createConnection({
        host: config.db.host,
        user: config.db.user,
        database: config.db.database,
        password: config.db.password
        /* host: "localhost",
        user: "root",
        database:"CAL",
        password: "sql65536!#HYUJ" */
    });
    return connection;
}

// retrieve data from lite database file
var sqlite3 = require('sqlite3').verbose();

function connectToLiteDatabase() {
    var db = new sqlite3.Database(config.sqliteDB.path, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the SQLite database.');
    });
    return db;
}

module.exports = connectToLiteDatabase, connectToDatabase;
