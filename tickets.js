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
  function handleOtherRequests(req, res, path, method) {
  const pathSegments = path.split('/').filter(p => p);
  
  if (pathSegments.length > 1) {
    const entity = pathSegments[0];
    const entityId = pathSegments[1];

    switch (entity) {
      case "appointment":
        if (method === 'GET') {
          // Logic to view appointments details
          viewAppointments(entityId, res);
        } else if (method === 'DELETE') {
          // Logic to cancel an appointment
          cancelAppointment(entityId, res);
        }
        break;
      case "support":
        if (method === 'GET') {
          // Logic to view support ticket details
          viewSupportTicket(entityId, res);
        } else if (method === 'PUT') {
          // Logic to update a support ticket's status
          updateSupportTicket(req, entityId, res);
        }
        break;
      case "member":
        if (method === 'DELETE') {
          // Logic to delete a member account
          deleteMember(entityId, res);
        }
        break;
      default:
        res.writeHead(404);
        res.end('Not Found');
    }
  } else {
    res.writeHead(400);
    res.end('Invalid Request');
  }
}

function viewAppointments(appointmentId, res) {
  db.get(`SELECT * FROM Appointments WHERE AppointmentID = ?`, [appointmentId], (err, row) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    if (row) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(row));
    } else {
      res.writeHead(404);
      res.end('Appointment not found');
    }
  });
}

function cancelAppointment(appointmentId, res) {
  db.run(`DELETE FROM Appointments WHERE AppointmentID = ?`, [appointmentId], function(err) {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    if (this.changes > 0) {
      res.writeHead(200);
      res.end('Appointment canceled successfully');
    } else {
      res.writeHead(404);
      res.end('Appointment not found');
    }
  });
}

function viewSupportTicket(ticketId, res) {
  db.get(`SELECT * FROM SupportTickets WHERE TicketID = ?`, [ticketId], (err, row) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    if (row) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(row));
    } else {
      res.writeHead(404);
      res.end('Support ticket not found');
    }
  });
}

function updateSupportTicket(req, ticketId, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    const { status } = data;

    db.run(`UPDATE SupportTickets SET Status = ? WHERE TicketID = ?`, [status, ticketId], function(err) {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      if (this.changes > 0) {
        res.writeHead(200);
        res.end('Support ticket updated successfully');
      } else {
        res.writeHead(404);
        res.end('Support ticket not found');
      }
    });
  });
}

function deleteMember(memberId, res) {
  db.run(`DELETE FROM Users WHERE UserID = ?`, [memberId], function(err) {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    if (this.changes > 0) {
      res.writeHead(200);
      res.end('Member deleted successfully');
    } else {
      res.writeHead(404);
      res.end('Member not found');
    }
  });
}

}

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
