const mysql = require("mysql2");
const config = require('./config.js');
const connect = mysql.createConnection({
host: config.db.host,
user: config.db.user,
database: config.db.database,
password: config.db.password
});
connect.connect(function(err) {
if (err) throw err;
console.log("Connected to the MySQL database");
connect.query("select * from classes", function (err, result) {
if (err) throw err;;
});
});
