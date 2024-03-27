const http = require('http');
const url = require('url');
const ticketController = require('./controllers/ticketController');

// Require db.js here to ensure database initialization occurs
require('./models/db');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // Set up headers for JSON response
    res.setHeader('Content-Type', 'application/json');

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
        // Parse the body to JSON, if any
        let data = {};
        try {
            if (body) data = JSON.parse(body);
        } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON body." }));
            return;
        }

        // Modified route handling logic to pass request data correctly
        if (path === '/tickets/create' && method === 'POST') {
            ticketController.createTicket({ body: data }, res);
        } else if (path === '/tickets/reply' && method === 'POST') {
            ticketController.addReplyToTicket(data, res);
        } else if (path.startsWith('/tickets/details/') && method === 'GET') {
            const ticketId = path.split('/')[3];
            ticketController.getTicketDetails({ params: { ticketId } }, res);
        }
        else if (path.startsWith('/tickets/close/') && method === 'POST') {
            const ticketId = path.split('/')[3]; // Extracting ticket ID from the URL
            // Assuming you have a function in your ticketController for closing a ticket
            ticketController.closeTicket({ params: { ticketId } }, res);
        }
        else if (path.startsWith('/tickets/open/') && method === 'POST') {
            const ticketId = path.split('/')[3]; // Extracting ticket ID from the URL
            // Assuming you have a function in your ticketController for closing a ticket
            ticketController.openTicket({ params: { ticketId } }, res);
        }else if (path.startsWith('/tickets/faqs') && method === 'GET') {
            ticketController.getFAQs(req, res);
        }else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Route not found." }));
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
