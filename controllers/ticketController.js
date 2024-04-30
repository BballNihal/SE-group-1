const fs = require('fs');
const path = require('path');
const ticketModel = require('../models/ticket');

const isGuestUser = (userId) => parseInt(userId, 10) === 0;

// Generic error message for guest users attempting to access restricted actions
const guestErrorMessage = { error: "Guest users don't have permission for this action" };

exports.createTicket = (req, res) => {
    const { userId, subject, description } = req.body;
    ticketModel.createTicket(userId, subject, description, (err, ticketId) => {
        if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to create ticket", details: err }));
        } 
        else if (isGuestUser(req.body.userId)) {
            res.writeHead(403); // HTTP status code 403 Forbidden
            return res.end(JSON.stringify(guestErrorMessage));
        }
        else {
            res.statusCode = 201;
            res.end(JSON.stringify({ message: "Ticket created successfully", ticketId: ticketId }));
        }
    });
};


exports.addReplyToTicket = (req, res) => {
    const { ticketId, userId, message } = req;

    // Ensure userId is treated as an integer for comparison
    const intUserId = parseInt(userId, 10);

    // First, check if the ticket belongs to the user or if the user is an admin (-1)
    ticketModel.getTicketOwner(ticketId, (err, ownerUserId) => {
        if (err) {
            console.error("Error fetching ticket owner:", err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to fetch ticket details' }));
            return;
        }
        
        // Ensure ownerUserId is also treated as an integer
        const intOwnerUserId = parseInt(ownerUserId, 10);

        if (intUserId !== intOwnerUserId && intUserId !== -1) {
            // User is neither the ticket owner nor an admin
            res.writeHead(403);
            res.end(JSON.stringify({ error: 'You do not have permission to reply to this ticket' }));
            return;
        }

        // User is either the ticket owner or an admin, proceed to add the reply
        ticketModel.addReplyToTicket(ticketId, userId, message, (err, replyId) => {
            if (err) {
                console.error("Error inserting reply into database:", err.message);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to add reply to ticket' }));
                return;
            }
            
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Reply added successfully', replyId: replyId }));
        });
    });
};


exports.getTicketDetails = (req, res) => {
    const { ticketId } = req.params; // URL parameter
    const userId = parseInt(req.query.userId, 10); // Ensure userId is an integer

    // First, check if the ticket belongs to the user or if the user is an admin (-1)
    ticketModel.getTicketOwner(ticketId, (err, ownerUserId) => {
        if (err) {
            console.error("Error fetching ticket owner:", err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to fetch ticket details' }));
            return;
        }

        // Ensure ownerUserId is treated as an integer for comparison
        const intOwnerUserId = parseInt(ownerUserId, 10);

        if (userId !== intOwnerUserId && userId !== -1) {
            // User is neither the ticket owner nor an admin
            res.writeHead(403);
            res.end(JSON.stringify({ error: 'You do not have permission to view these ticket details' }));
            return;
        }

        // User is either the ticket owner or an admin, proceed to fetch and return the ticket details
        ticketModel.getTicketDetails(ticketId, (err, ticketDetails) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Error fetching ticket details", details: err }));
                return;
            }

            if (!ticketDetails) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "Ticket not found" }));
            } else {
                res.statusCode = 200;
                res.end(JSON.stringify(ticketDetails));
            }
        });
    });
};


exports.closeTicket = (req, res) => {
    const { ticketId } = req.params; // URL parameter
    const userId = parseInt(req.body.userId, 10); // Convert userId from request body to number

    ticketModel.getTicketOwner(ticketId, (err, ownerUserId) => {
        if (err) {
            console.error("Error fetching ticket owner:", err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to close ticket due to server error' }));
            return;
        }

        if (userId !== ownerUserId && userId !== -1) {
            // User is neither the ticket owner nor an admin
            res.writeHead(403);
            res.end(JSON.stringify({ error: 'You do not have permission to close this ticket' }));
            return;
        }

        // User is the ticket owner or an admin, proceed to close the ticket
        ticketModel.closeTicket(ticketId, (err, result) => {
            if (err) {
                console.error("Error closing ticket:", err.message);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to close ticket' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Ticket closed successfully' }));
        });
    });
};






exports.openTicket = (req, res) => {
    const { ticketId } = req.params; // URL parameter
    const userId = parseInt(req.body.userId, 10); // Convert userId from request body to number

    ticketModel.getTicketOwner(ticketId, (err, ownerUserId) => {
        if (err) {
            console.error("Error fetching ticket owner:", err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to open ticket due to server error' }));
            return;
        }

        if (userId !== ownerUserId && userId !== -1) {
            // User is neither the ticket owner nor an admin
            res.writeHead(403);
            res.end(JSON.stringify({ error: 'You do not have permission to open this ticket' }));
            return;
        }

        // User is the ticket owner or an admin, proceed to open the ticket
        ticketModel.openTicket(ticketId, (err, result) => {
            if (err) {
                console.error("Error opening ticket:", err.message);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to open ticket' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Ticket opened successfully' }));
        });
    });
};


exports.getFAQs = (req, res) => {
    const faqFilePath = path.join(__dirname, '..', 'scraped_faq.txt'); // Adjust the path as necessary

    fs.readFile(faqFilePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            console.error("Error reading FAQ file:", err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to read FAQ file' }));
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
    });
};