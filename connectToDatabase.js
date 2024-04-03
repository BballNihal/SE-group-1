var sql = require("mysql2");
const config = require('./config.js');

function connectToDatabase() {
    var connection = sql.createConnection({
        host: config.db.host,
        user: config.db.user,
        database: config.db.database,
        password: config.db.password
    });
    return connection;
}
module.exports = connectToDatabase;