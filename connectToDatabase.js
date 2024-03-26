var sql = require("mysql2");
function connectToDatabase() {
    var connection = sql.createConnection({
        host: "localhost",
        user: "root",
        database:"SHOP",
        password: "098plmokN"
    });
    return connection;
}
module.exports = connectToDatabase;