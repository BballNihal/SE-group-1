const ticketModel = require('../models/ticket');

// Assuming this is in ticketController.js
exports.createTicket = (req, res) => {
    const { userId, subject, description } = req.body; // Ensure these names match your request body
    ticketModel.createTicket(userId, subject, description, (err, ticketId) => {
        if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to create ticket", details: err }));
        } else {
            res.statusCode = 201;
            res.end(JSON.stringify({ message: "Ticket created successfully", ticketId: ticketId }));
        }
    });
};


exports.addReplyToTicket = (data, res) => {
    const { ticketId, userId, message } = data;
    ticketModel.addReplyToTicket(ticketId, userId, message, (err, replyId) => {
        if (err) {
            console.error("Error inserting reply into database:", err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to add reply to ticket' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Reply added successfully', replyId: replyId }));
        }
    });
};

exports.getTicketDetails = (req, res) => {
    const { ticketId } = req.params; // Ensure you're extracting ticketId correctly

    ticketModel.getTicketDetails(ticketId, (err, ticketDetails) => {
        if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error fetching ticket details", details: err }));
        } else if (!ticketDetails) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Ticket not found" }));
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(ticketDetails));
        }
    });
};

exports.closeTicket = (req, res) => {
    const { ticketId } = req.params; // Assuming ticketId is passed as a URL parameter

    ticketModel.closeTicket(ticketId, (err, result) => {
        if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to close ticket' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify(result));
        }
    });
};

exports.openTicket = (req, res) => {
    const { ticketId } = req.params; // Assuming ticketId is passed as a URL parameter

    ticketModel.openTicket(ticketId, (err, result) => {
        if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to open ticket' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify(result));
        }
    });
};


exports.reopenTicket = (data, res) => {
    const { ticketId } = data;
    ticketModel.reopenTicket(ticketId, (err, result) => {
        if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to reopen ticket' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Ticket reopened successfully' }));
        }
    });
};
