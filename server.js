const http = require('http');
const url = require('url');
// Assuming you have a controller set up similar to what was described
const { createTicket, addReplyToTicket, getTicketDetails, reopenTicket } = require('./controllers/ticketController');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Parsing request method
  const method = req.method.toUpperCase();

  // Helper function to read body data
  const getRequestBody = (req, callback) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      callback(body);
    });
  };

  // Routing
  if (trimmedPath === 'tickets/create' && method === 'POST') {
    getRequestBody(req, (body) => {
      // Convert the body string to a JSON object
      const requestData = JSON.parse(body);
      createTicket(requestData, res);
    });
  } else if (trimmedPath === 'tickets/reply' && method === 'POST') {
    getRequestBody(req, (body) => {
      const requestData = JSON.parse(body);
      addReplyToTicket(requestData, res);
    });
  } else if (trimmedPath.match(/^tickets\/details\/\d+$/) && method === 'GET') {
    // Extract ticketId from the URL
    const ticketId = trimmedPath.split('/')[2];
    getTicketDetails(ticketId, res);
  } else if (trimmedPath === 'tickets/reopen' && method === 'PUT') {
    getRequestBody(req, (body) => {
      const requestData = JSON.parse(body);
      reopenTicket(requestData, res);
    });
  } else {
    // Not Found handler
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
