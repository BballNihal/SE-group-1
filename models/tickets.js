const db = require('../database/db.js');

function createTicket(userId, subject, description, callback) {
  const sql = `INSERT INTO SupportTickets (UserID, Subject, Description) VALUES (?, ?, ?)`;
  db.run(sql, [userId, subject, description], function(err) {
    callback(err, this.lastID);
  });
}

function addReplyToTicket(ticketId, userId, message, callback) {
  const sql = `INSERT INTO TicketReplies (TicketID, UserID, Message) VALUES (?, ?, ?)`;
  db.run(sql, [ticketId, userId, message], function(err) {
    callback(err, this.lastID);
  });
}

function getTicketDetails(ticketId, callback) {
  const sql = `
    SELECT t.TicketID, t.Subject, t.Description, t.Status, t.CreatedAt, 
           r.ReplyID, r.Message, r.ReplyAt, u.Username AS Replier 
    FROM SupportTickets t
    LEFT JOIN TicketReplies r ON t.TicketID = r.TicketID
    LEFT JOIN Users u ON r.UserID = u.UserID
    WHERE t.TicketID = ?
    ORDER BY r.ReplyAt ASC
  `;
  db.all(sql, [ticketId], function(err, rows) {
    callback(err, rows);
  });
}

function reopenTicket(ticketId, callback) {
  const sql = `UPDATE SupportTickets SET Status = 'Open' WHERE TicketID = ?`;
  db.run(sql, [ticketId], function(err) {
    if (err) {
      callback(err);
    } else {
      // Check if the ticket was successfully updated; `this.changes` indicates the number of rows affected
      if (this.changes > 0) {
        callback(null, { message: 'Ticket reopened successfully.' });
      } else {
        callback(new Error('Ticket not found.'));
      }
    }
  });
}

module.exports = {
  createTicket,
  addReplyToTicket,
  getTicketDetails,
  reopenTicket, // Make sure to export the new function
};
