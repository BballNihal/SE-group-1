const sqlite3 = require('sqlite3').verbose();

function adminAddCarInfo(req, res, car, lastCarID, memberdb, callback) {
    // Validation code
    const requiredProperties = ['memberID', 'carMake', 'carModel', 'carYear'];
    for (let prop of requiredProperties) {
        if (!car.hasOwnProperty(prop)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Missing required property: ${prop}`);
            return;
        }
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

    if (lastCarID >= 9999999999) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('No more car IDs available');
        return;
    }

    lastCarID = Number(lastCarID);
    lastCarID++;

    car.carID = 'C' + String(lastCarID).padStart(10, '0');

    // Insert car and call callback with the new lastCarID
    memberdb.run(`INSERT INTO cars VALUES (?, ?, ?, ?, ?)`, [car.carID, car.memberID, car.carMake, car.carModel, car.carYear], function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Database error: ${err}`);
        } else {
            res.end(`Car registered successfully. Your car ID is ${car.carID}`);
            callback(lastCarID);  // Call the callback with the new lastCarID
        }
    });
}
module.exports = adminAddCarInfo;
