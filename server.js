const http = require('http');
const url = require('url');
const ticketController = require('./controllers/ticketController');

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
        // Parse the body to JSON
        let data = {};
        try {
            if (body) data = JSON.parse(body);
        } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON body." }));
            return;
        }

        // Handling different routes based on the path and method
        if (path === '/tickets/create' && method === 'POST') {
            req.body = data; // Add parsed data back to request object
            ticketController.createTicket(req, res);
        } else if (path === '/tickets/reply' && method === 'POST') {
            req.body = data;
            ticketController.addReplyToTicket(req, res);
        } else if (path.match(/\/tickets\/\d+$/) && method === 'GET') {
            // Extract ticketId from the URL
            const ticketId = path.split("/")[2];
            req.params = { ticketId }; // Add ticketId to request object
            ticketController.getTicketDetails(req, res);
        } else if (path === '/tickets/reopen' && method === 'POST') {
            req.body = data;
            ticketController.reopenTicket(req, res);
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Route not found." }));
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
