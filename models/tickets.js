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
