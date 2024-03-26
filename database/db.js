const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to your database file
const dbPath = path.resolve(__dirname, 'customerService.db');

// Establish a connection to the SQLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the customer service database.');
    initializeDatabase(); // Call function to initialize database tables
  }
});

// Function to initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT UNIQUE NOT NULL,
        Password TEXT NOT NULL,
        Email TEXT UNIQUE NOT NULL,
        PhoneNumber TEXT,
        AdminStatus INTEGER DEFAULT 0
      );
    `);

    // Create SupportTickets table
    db.run(`
      CREATE TABLE IF NOT EXISTS SupportTickets (
        TicketID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        Subject TEXT NOT NULL,
        Description TEXT,
        Status TEXT DEFAULT 'Open',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
      );
    `);

    // Create TicketReplies table
    db.run(`
      CREATE TABLE IF NOT EXISTS TicketReplies (
        ReplyID INTEGER PRIMARY KEY AUTOINCREMENT,
        TicketID INTEGER NOT NULL,
        UserID INTEGER NOT NULL,
        Message TEXT,
        ReplyAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(TicketID) REFERENCES SupportTickets(TicketID),
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
      );
    `);
  });
}

// Export the database connection for use in other parts of the application
module.exports = db;
