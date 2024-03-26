const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 3000;

// Open the database
let db = new sqlite3.Database('databases/productDB/products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the products database.');
});

app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
});

app.get('/products/:productID', (req, res) => {
    let sql = `SELECT * FROM products WHERE productID = ?`;
    db.get(sql, [req.params.productID], (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
