const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Route to create a new ticket
router.post('/create', ticketController.createTicket);

// Route to add a reply to a ticket
router.post('/reply', ticketController.addReplyToTicket);

// Route to get ticket details
router.get('/details/:ticketId', ticketController.getTicketDetails);

// Route to reopen a ticket
router.put('/reopen', ticketController.reopenTicket);

module.exports = router;
