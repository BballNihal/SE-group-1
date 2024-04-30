const sqlite3 = require('sqlite3').verbose();

function adminDeleteCarInfo(req, res, car, memberdb) {
    // Validation code
    if (!car.hasOwnProperty('carID')) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Missing required property: carID`);
        return;
    }

    const carID = car.carID;

    const carIDRegex = /^C\d{5}$/;
    if (!carIDRegex.test(car.carID)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid CarID');
        return;
    }

    memberdb.run(`DELETE FROM cars WHERE carID = ?`, car.carID, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error');
        } else {
            res.end(`Car deleted successfully. Your car ID was ${car.carID}`);
        }
    });
}

module.exports = adminDeleteCarInfo;