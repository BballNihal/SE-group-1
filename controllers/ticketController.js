const TicketModel = require('../models/ticket');

exports.createTicket = (req, res) => {
  const { userId, subject, description } = req.body;
  TicketModel.createTicket(userId, subject, description, (err, ticketId) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Error creating ticket' }));
    } else {
      res.writeHead(201);
      res.end(JSON.stringify({ message: 'Ticket created successfully', ticketId }));
    }
  });
};

exports.addReplyToTicket = (req, res) => {
  const { ticketId, userId, message } = req.body;
  TicketModel.addReplyToTicket(ticketId, userId, message, (err, replyId) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Error adding reply to ticket' }));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Reply added successfully', replyId }));
    }
  });
};

exports.getTicketDetails = (req, res) => {
  const ticketId = req.params.ticketId;
  TicketModel.getTicketDetails(ticketId, (err, ticketDetails) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Error fetching ticket details' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ticketDetails));
    }
  });
};

exports.reopenTicket = (req, res) => {
  const { ticketId } = req.body;
  TicketModel.reopenTicket(ticketId, (err) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Error reopening ticket' }));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Ticket reopened successfully' }));
    }
  });
};
