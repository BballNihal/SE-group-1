const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configure the path to your SQLite database
const dbPath = path.resolve(__dirname, 'customerService.db');

// Establish a connection to the SQLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error('Error opening database', err);
    else console.log('Connected to the SQLite database at', dbPath);
});

// Function to add an appointment
exports.addAppointment = (memberID, appointmentTime, specification, callback) => {
    const sql = `INSERT INTO Appointments (MemberID, AppointmentTime, Specification) VALUES (?, ?, ?)`;
    db.run(sql, [memberID, appointmentTime, specification], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { appointmentID: this.lastID });
        }
    });
};

// Function to cancel an appointment
exports.cancelAppointment = (appointmentID, callback) => {
    const sql = `SELECT * FROM Appointments WHERE AppointmentID = ?`;
    db.get(sql, [appointmentID], (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        if (!result) {
            callback(null, false); // No appointment found
            return;
        }
        const deleteSql = `DELETE FROM Appointments WHERE AppointmentID = ?`;
        db.run(deleteSql, [appointmentID], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, true); // Appointment deleted successfully
            }
        });
    });
};

// Function to retrieve appointments by member ID
exports.getAppointmentsByMemberID = (memberID, callback) => {
    const sql = `SELECT * FROM Appointments WHERE MemberID = ?`;
    db.all(sql, [memberID], (err, appointments) => {
        if (err) {
            callback(err);
        } else {
            callback(null, appointments);
        }
    });
};

// Function to update an appointment
exports.changeAppointment = (appointmentID, newTime, newSpecification, callback) => {
    const checkSql = `SELECT * FROM Appointments WHERE AppointmentID = ?`;
    db.get(checkSql, [appointmentID], (checkErr, result) => {
        if (checkErr) {
            callback(checkErr);
            return;
        }
        if (!result) {
            callback(null, false); // No appointment found
            return;
        }
        const updateSql = `UPDATE Appointments SET AppointmentTime = ?, Specification = ? WHERE AppointmentID = ?`;
        db.run(updateSql, [newTime, newSpecification, appointmentID], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, true); // Appointment updated successfully
            }
        });
    });
};
