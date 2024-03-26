const TicketModel = require('../models/ticket');

// Handle creating a new ticket
exports.createTicket = (req, res) => {
  const { userId, subject, description } = req.body;
  TicketModel.createTicket(userId, subject, description, (err, ticketId) => {
    if (err) {
      res.status(500).send({ message: 'Error creating ticket' });
    } else {
      res.status(201).send({ message: 'Ticket created successfully', ticketId: ticketId });
    }
  });
};

// Handle adding a reply to a ticket
exports.addReplyToTicket = (req, res) => {
  const { ticketId, userId, message } = req.body;
  TicketModel.addReplyToTicket(ticketId, userId, message, (err, replyId) => {
    if (err) {
      res.status(500).send({ message: 'Error adding reply to ticket' });
    } else {
      res.status(200).send({ message: 'Reply added successfully', replyId: replyId });
    }
  });
};

// Handle fetching ticket details, including replies
exports.getTicketDetails = (req, res) => {
  const { ticketId } = req.params; // Assuming ticketId is passed as a URL parameter
  TicketModel.getTicketDetails(ticketId, (err, ticketDetails) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching ticket details' });
    } else {
      res.status(200).send(ticketDetails);
    }
  });
};

// Handle reopening a ticket
exports.reopenTicket = (req, res) => {
  const { ticketId } = req.body; // Assuming ticketId is passed in the request body
  TicketModel.reopenTicket(ticketId, (err, response) => {
    if (err) {
      res.status(500).send({ message: 'Error reopening ticket' });
    } else {
      res.status(200).send(response);
    }
  });
};
