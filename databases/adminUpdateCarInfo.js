const sqlite3 = require('sqlite3').verbose();

function adminUpdateCarInfo(req, res, car, memberdb) {
    // Validation code
    const requiredProperties = ['carID', 'memberID', 'carMake', 'carModel', 'carYear'];
    for (let prop of requiredProperties) {
        if (!car.hasOwnProperty(prop)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Missing required property: ${prop}`);
            return;
        }
    }

    const carIDRegex = /^C\d{10}$/;
    if (!carIDRegex.test(car.carID)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Member ID must start with "C" followed by a 10 digit number');
        return;
    }
    
    const memberIDRegex = /^M\d{10}$/;
    if (!memberIDRegex.test(car.memberID)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Member ID must start with "M" followed by a 5 digit number');
        return;
    }

    const carYearRegex = /^\d{4}$/;
    if (!carYearRegex.test(car.carYear)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Car year must be a valid year in the format of YYYY');
        return;
    }

    memberdb.run(`UPDATE cars SET memberID = ?, carMake = ?, carModel = ?, carYear = ? WHERE carID = ?`, [car.memberID, car.carMake, car.carModel, car.carYear, car.carID], function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error');
        } else {
            res.end(`Car updated successfully. Your car ID is ${car.carID}`);
        }
    });
}

module.exports = adminUpdateCarInfo;
