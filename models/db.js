const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'customerService.db');

// Establish a connection to the SQLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the customer service database at', dbPath);
    initializeDatabase();
  }
});

// Function to initialize database tables
function initializeDatabase() {
  console.log("Initializing database tables...");
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
    `, [], err => {
      if (err) {
        console.error('Error creating Users table:', err);
      } else {
        console.log('Users table created or already exists.');
      }
    });

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
    `, [], err => {
      if (err) {
        console.error('Error creating SupportTickets table:', err);
      } else {
        console.log('SupportTickets table created or already exists.');
      }
    });

    // Create Product Review Database
    db.run(`
      CREATE TABLE IF NOT EXISTS ProductReviews (
        ReviewID TEXT PRIMARY KEY CHECK(ReviewID GLOB 'R[0-9][0-9][0-9][0-9][0-9]'),
        MemberID TEXT NOT NULL CHECK(MemberID GLOB 'M[0-9][0-9][0-9][0-9][0-9]'),
        ProductID TEXT NOT NULL CHECK(ProductID GLOB 'P[0-9][0-9][0-9][0-9][0-9]'),
        ReviewContent TEXT,
        Rating INTEGER CHECK(Rating >= 1 AND Rating <= 5),
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, [], err => {
      if (err) {
        console.error('Error creating ProductReviews table:', err);
      } else {
        console.log('ProductReviews table created or already exists.');
      }
    });

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
    `, [], err => {
      if (err) {
        console.error('Error creating TicketReplies table:', err);
      } else {
        console.log('TicketReplies table created or already exists.');
      }
    });
  });
}

// Export the database connection for use in other parts of the application
module.exports = db;
