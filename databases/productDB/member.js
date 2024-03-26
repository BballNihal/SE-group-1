/*
The purpose of this code is to generate a member database
and also allow for admins to add, remove, and edit member data within the database
This takes the input of an admin user and outputs it to the database memberData.db
This does input verfication of making sure username, password,phonenumber, and admin status are all following correct guidlines
It is also generates the memberID of a user in order from M00000 to M99999 
AUTHOR: Henry Sprigle
*/
const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./memberData.db');
let lastMemberID = 0;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const method = req.method;

  if (method === 'POST' && path === '/member') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const member = JSON.parse(body);

      // Validation code
      const requiredProperties = ['username', 'password', 'phoneNumber', 'adminStatus'];
      for (let prop of requiredProperties) {
        if (!member.hasOwnProperty(prop)) {
          res.writeHead(400, {'Content-Type': 'text/plain'});
          res.end(`Missing required property: ${prop}`);
          return;
        }
      }

      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!emailRegex.test(member.username)) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Username must be a valid email');
        return;
      }

      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(member.phoneNumber)) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Phone number must be a valid number with 10 to 15 digits');
        return;
      }

      if (![0, 1].includes(member.adminStatus)) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Admin status must be 0 (normal) or 1 (admin)');
        return;
      }

      if (lastMemberID >= 99999) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('No more member IDs available');
        return;
      }

      lastMemberID++;
      member.memberID = 'M' + String(lastMemberID).padStart(5, '0');

      db.run(`INSERT INTO members VALUES (?, ?, ?, ?, ?)`, [member.memberID, member.username, member.password, member.phoneNumber, member.adminStatus], function(err) {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Database error');
        } else {
          res.end(`Member registered successfully. Your member ID is ${member.memberID}`);
        }
      });
    });
  } else if (method === 'PUT' && path.startsWith('/member/')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const member = JSON.parse(body);
      const memberID = path.split('/')[2];

      db.run(`UPDATE members SET username = ?, password = ?, phoneNumber = ?, adminStatus = ? WHERE memberID = ?`, [member.username, member.password, member.phoneNumber, member.adminStatus, memberID], function(err) {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Database error');
        } else {
          res.end(`Member updated successfully. Your member ID is ${memberID}`);
        }
      });
    });
  } else if (method === 'DELETE' && path.startsWith('/member/')) {
    const memberID = path.split('/')[2];

    db.run(`DELETE FROM members WHERE memberID = ?`, memberID, function(err) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Database error');
      } else {
        res.end(`Member deleted successfully. Your member ID was ${memberID}`);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

db.serialize(() => {
  db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='members'`, (err, row) => {
    if (!row) {
      db.run(`CREATE TABLE members (memberID TEXT, username TEXT, password TEXT, phoneNumber TEXT, adminStatus INTEGER)`, (err) => {
        if (err) {
          console.error('Failed to create table:', err);
          return;
        }
        console.log('Table created successfully.');
      });
    }
  });

  db.get(`SELECT memberID FROM members ORDER BY memberID DESC LIMIT 1`, (err, row) => {
    if (row) {
      lastMemberID = parseInt(row.memberID.substring(1));
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
// clearDatabase(db);
// function clearDatabase(db) {
//   db.serialize(() => {
//     db.run(`DELETE FROM members`, (err) => {
//       if (err) {
//         console.error('Failed to clear table:', err);
//         return;
//       }
//       console.log('Table cleared successfully.');
//       lastMemberID = 0;  // Reset lastMemberID here
//     });
//   });
// }
module.exports = server;