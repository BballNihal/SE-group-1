const sqlite3 = require('sqlite3').verbose();

function adminGetCarInfo(req, res, car, memberdb) {
    const carID = car.carID;

    memberdb.get(`SELECT carID, memberID, carMake, carModel, carYear FROM cars WHERE carID = ?`, [carID], function(err, row) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Database error: ${err}`);
        } else if (row) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(row));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Car not found`);
        }
    });
}

module.exports = adminGetCarInfo;