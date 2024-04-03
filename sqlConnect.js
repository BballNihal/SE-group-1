const mysql = require("mysql2");
const connect = mysql.createConnection({
host: "localhost",
user: "root",
database:"DB",
password: "sql65536!#HYUJ"
});
connect.connect(function(err) {
if (err) throw err;
console.log("Connected to the MySQL database");
connect.query("select * from classes", function (err, result) {
if (err) throw err;;
});
});
