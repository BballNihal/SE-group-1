const appointmentModel = require('../models/appointment'); // Ensure this path is correct

// Function to handle adding an appointment
exports.addAppointment = (req, res) => {
    const { MemberID, Appointment_time, Specification } = req.body;
    appointmentModel.addAppointment(MemberID, Appointment_time, Specification, (err, result) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to add appointment", details: err.message }));
        } else {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Appointment added successfully", Appointment_id: result.appointmentID }));
        }
    });
};

// Function to handle cancelling an appointment
exports.cancelAppointment = (req, res) => {
    const { Appointment_id } = req.query;
    appointmentModel.cancelAppointment(Appointment_id, (err, wasDeleted) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to cancel appointment", details: err.message }));
        } else if (!wasDeleted) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No appointment found with the given ID" }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Appointment canceled successfully" }));
        }
    });
};

// Function to handle viewing all appointments for a member
exports.viewAppointment = (req, res) => {
    const { MemberID } = req.query;
    appointmentModel.getAppointmentsByMemberID(MemberID, (err, appointments) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to retrieve appointments", details: err.message }));
        } else if (appointments.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No appointments found for the given Member ID" }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ appointments }));
        }
    });
};

// Function to handle changing an appointment
exports.changeAppointment = (req, res) => {
    const { Appointment_id, Appointment_time, Specification } = req.body;
    appointmentModel.changeAppointment(Appointment_id, Appointment_time, Specification, (err, wasUpdated) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to change appointment", details: err.message }));
        } else if (!wasUpdated) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No appointment found with the given ID" }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Appointment changed successfully", Appointment_id }));
        }
    });
};
