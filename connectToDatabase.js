var sql = require("mysql2");
function connectToDatabase() {
    var connection = sql.createConnection({
        host: "localhost",
        user: "root",
        database:"SHOP",
<<<<<<< HEAD
        password: "sql65536!#HYUJ"
        //database:"SHOP",
        //password: "098plmokN"
=======
        password: "098plmokN"
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
    });
    return connection;
}
module.exports = connectToDatabase;