//AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

function getProducts(req, res) {
  const productID = req.body.productID; // Retrieve productID from the request body

  // Open the database
  let db = new sqlite3.Database('databases/productDB/products.db', (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error connecting to the database');
      return;
    }
    console.log('Connected to the products database.');

    if (productID) {
      // Fetch product by ID
      let sql = `SELECT * FROM products WHERE productID = ?`;
      db.get(sql, [productID], (err, row) => {
        if (err) {
          res.status(500).send('Error fetching product');
          return;
        }
        res.send(row);
      });
    } else {
      // No productID provided, fetch all products
      db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
          res.status(500).send('Error fetching products');
          return;
        }
        res.send(rows);
      });
    }
  });
}

module.exports = { getProducts };
