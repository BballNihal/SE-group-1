var sql = require("mysql2");
const config = require('config');

function connectToDatabase() {
    var connection = sql.createConnection({
        host: config.get('db.host'),
        user: config.get('db.user'),
        password: config.get('db.password'),
        database: config.get('db.database')
    });
    return connection;
}
module.exports = connectToDatabase;