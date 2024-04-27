const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

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

  if (pathname === '/products') {
    if (req.method === 'GET') {
      const productID = parsedUrl.query.productID;
      getProducts(req, res, productID);
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

function getProducts(req, res, productID) {
  if (productID) {
      // Fetch product by ID
      let sql = `SELECT * FROM products WHERE productID = ?`;
      db.get(sql, [productID], (err, row) => {
          if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Error fetching product');
              return;
          }
          if (row) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(row));
          } else {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('Product not found');
          }
      });
  } else {
      // No productID provided, fetch all products
      db.all('SELECT * FROM products', [], (err, rows) => {
          if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Error fetching products');
              return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(rows));
      });
  }
}



function addProductToDatabase(db, product, res) {
  // Check if productID or name already exists
  const checkSql = `SELECT * FROM products WHERE productID = ? OR name = ?`;
  db.get(checkSql, [product.productID, product.name], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`ProductID or name already exists.`);
      return;
    }

    // Insert the product into the database
    const insertSql = 'INSERT INTO products (productID, productType, name, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.run(insertSql, [product.productID, product.productType, product.name, product.price, product.quantity], (err) => {
      if (err) {
        throw err;
      }
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end(`Product ${product.productID} added.`);
    });
  });
}

function deleteProductFromDatabase(db, productID, res) {
  if (!productID) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Product ID is missing in the request body');
    return;
  }

  // Delete the product from the database
  const deleteSql = 'DELETE FROM products WHERE productID = ?';
  db.run(deleteSql, [productID], (err) => {
    if (err) {
      throw err;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Product ${productID} deleted.`);
  });
}

function updateProductQuantity(db, productID, change, res) {
  if (!Number.isInteger(change)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(`Invalid change value. It must be an integer number.`);
    return;
  }

  // Fetch the current quantity from the database
  const selectSql = `SELECT quantity FROM products WHERE productID = ?`;
  db.get(selectSql, [productID], (err, row) => {
    if (err) {
      throw err;
    }
    if (!row) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Product ${productID} not found.`);
      return;
    }

    const currentQuantity = row.quantity;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 0) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`Invalid quantity. The resulting quantity cannot be negative.`);
      return;
    }

    // Update the product quantity in the database
    const updateSql = `UPDATE products SET quantity = ? WHERE productID = ?`;
    db.run(updateSql, [newQuantity, productID], (err) => {
      if (err) {
        throw err;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Product ${productID} updated. New quantity: ${newQuantity}.`);
    });
  });
}


