const ticketModel = require('../models/ticket');

// Assuming this is in ticketController.js
exports.createTicket = (req, res) => {
    // Make sure you are parsing the request body in server.js as JSON
    const { userId, subject, description } = req.body; // Ensure these names match your request body

    // Call your model function and pass these values
    // Assuming your model function is correctly defined and expects (userId, subject, description, callback)
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
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to add reply to ticket' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Reply added successfully', replyId: replyId }));
        }
    });
};

exports.getTicketDetails = (ticketId, res) => {
    ticketModel.getTicketDetails(ticketId, (err, ticketDetails) => {
        if (err || !ticketDetails) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Ticket not found' }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify(ticketDetails));
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
