var sql = require("mysql2");
const config = require('config');
const host = config.get('db.host');
const user = config.get('db.user');
const database = config.get('db.database');
const password = config.get('db.password');
//edit in config.js
function connectToDatabase() {
    var connection = sql.createConnection({
        host: host,
        user: user,
        database: database,
        password: password
    });
    return connection;
}
module.exports = connectToDatabase;