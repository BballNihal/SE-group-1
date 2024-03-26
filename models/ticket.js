const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './customerService.db');

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error('Error opening database', err);
    else console.log('Connected to the SQLite database at', dbPath);
});


exports.createTicket = (userId, subject, description, callback) => {
  const sql = `INSERT INTO SupportTickets (UserId, Subject, Description) VALUES (?, ?, ?)`;
  db.run(sql, [userId, subject, description], function(err) {
      if (err) {
          console.error("Error inserting ticket into the database:", err);
          callback(err, null);
      } else {
          console.log(`A new ticket has been inserted with rowid ${this.lastID}`);
          callback(null, this.lastID);
      }
  });
};


exports.addReplyToTicket = (ticketId, userId, message, callback) => {
    const sql = `INSERT INTO TicketReplies (TicketID, UserID, Message) VALUES (?, ?, ?)`;
    db.run(sql, [ticketId, userId, message], function(err) {
        callback(err, this.lastID); // this.lastID returns the id of the newly inserted reply
    });
};

exports.getTicketDetails = (ticketId, callback) => {
  // First, fetch the ticket details
  db.get("SELECT * FROM SupportTickets WHERE TicketID = ?", [ticketId], (err, ticket) => {
      if (err) {
          callback(err);
          return;
      }
      if (!ticket) {
          callback(null, null); // No ticket found
          return;
      }

      // Then, fetch the replies for the ticket
      db.all("SELECT * FROM TicketReplies WHERE TicketID = ? ORDER BY ReplyID ASC", [ticketId], (err, replies) => {
          if (err) {
              callback(err);
              return;
          }

          // Combine the ticket with its replies
          const result = {
              ...ticket,
              Replies: replies
          };

          callback(null, result);
      });
  });
};


exports.reopenTicket = (ticketId, callback) => {
    const sql = `UPDATE Tickets SET Status = 'Open' WHERE TicketId = ?`;
    db.run(sql, [ticketId], function(err) {
        callback(err, { message: 'Ticket reopened successfully' });
    });
};
