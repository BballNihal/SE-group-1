//AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

function getProducts(req, res, productID, db) {
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

module.exports = { getProducts };
