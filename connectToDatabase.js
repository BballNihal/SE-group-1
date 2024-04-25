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
module.exports = connectToDatabase;