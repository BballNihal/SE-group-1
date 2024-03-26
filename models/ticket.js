const db = require('../database/db');


exports.createTicket = (userId, subject, description, callback) => {
  const sql = `INSERT INTO SupportTickets (UserID, Subject, Description, Status) VALUES (?, ?, ?, 'Open')`;
  db.run(sql, [userId, subject, description], function(err) {
    callback(err, this.lastID);
  });
};

exports.addReplyToTicket = (ticketId, userId, message, callback) => {
  const sql = `INSERT INTO TicketReplies (TicketID, UserID, Message) VALUES (?, ?, ?)`;
  db.run(sql, [ticketId, userId, message], function(err) {
    callback(err, this.lastID);
  });
};

exports.getTicketDetails = (ticketId, callback) => {
  const ticketSql = `SELECT * FROM SupportTickets WHERE TicketID = ?`;
  const repliesSql = `SELECT * FROM TicketReplies WHERE TicketID = ? ORDER BY CreatedAt ASC`;

  db.get(ticketSql, [ticketId], (err, ticket) => {
    if (err) return callback(err);
    db.all(repliesSql, [ticketId], (err, replies) => {
      if (err) return callback(err);
      callback(null, { ...ticket, replies });
    });
  });
};

exports.reopenTicket = (ticketId, callback) => {
  const sql = `UPDATE SupportTickets SET Status = 'Open' WHERE TicketID = ?`;
  db.run(sql, [ticketId], (err) => {
    callback(err);
  });
};
