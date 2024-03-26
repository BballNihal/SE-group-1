const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./customerService.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to the customer service database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
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

    db.run(`
      CREATE TABLE IF NOT EXISTS Appointments (
        AppointmentID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER,
        DateTime TEXT NOT NULL,
        Status TEXT DEFAULT 'Scheduled',
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS SupportTickets (
        TicketID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER,
        Description TEXT,
        Category TEXT,
        Status TEXT DEFAULT 'Open',
        FAQFlag BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
      );
    `);
  });
}

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const method = req.method;

  if (method === 'POST') {
    handlePostRequest(req, res, path);
  } else if (method === 'GET' || method === 'PUT' || method === 'DELETE') {
    handleOtherRequests(req, res, path, method);
  } else {
    res.writeHead(405);
    res.end(`Method ${method} not allowed`);
  }
});

function handlePostRequest(req, res, path) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(body);

    switch(path) {
      // Add cases for /register-user, /appointment/add, /support/submit, etc.
      default:
        res.writeHead(404);
        res.end('Not Found');
    }
  });
}

function handleOtherRequests(req, res, path, method) {
  // Add logic for GET, PUT, DELETE requests
}

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
