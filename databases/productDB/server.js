const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const querystring = require('querystring');

const {getProducts} = require('./getProducts.js');
const {updateProductQuantity} = require('./updateProductQuantity.js');
const {deleteProductFromDatabase} = require('./deleteProductFromDatabase.js');
const {addProductToDatabase} = require('./addProductToDatabase.js');


const port = 3000;

// Open the database
let db = new sqlite3.Database('databases/productDB/products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the products database.');
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  if (pathname === '/products') {
    if (req.method === 'GET') {
      const productID = parsedUrl.query.productID; // Extract productID from parsed query
      getProducts(req, res, productID, db);
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const product = JSON.parse(body);
        addProductToDatabase(db, product, res);
      });
    } else if (req.method === 'DELETE') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const productID = JSON.parse(body).productID;
        deleteProductFromDatabase(db, productID, res);
      });
    } else if (req.method === 'PUT') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const { productID, change } = JSON.parse(body);
        updateProductQuantity(db, productID, change, res);
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});







