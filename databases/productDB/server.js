const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

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

app.post('/products', (req, res) => {
    let validProductTypes = ["Bumpers", "Suspension", "BrakePads", "Clutches", "Engine", "Catalyst", "Downpipes", "Wheels", "InteriorTrim", "Tires"];
    let product = req.body;

    // Validate the product data
    if (!/^P\d{5}$/.test(product.productID)) {
        res.status(400).send(`Invalid productID format.`);
        return;
    }
    if (!validProductTypes.includes(product.productType)) {
        res.status(400).send(`Invalid productType.`);
        return;
    }
    // Remove commas from the price and validate the format
    let price = product.price.replace(/,/g, '');
    if (!/^\$\d+(\.\d+)?$/.test(price)) {
        res.status(400).send(`Invalid price format.`);
        return;
    }
    if (!Number.isInteger(product.quantity) || product.quantity < 0) {
        res.status(400).send(`Invalid quantity.`);
        return;
    }
    if (Object.values(product).some(value => value.length < 2 || value.length > 250)) {
        res.status(400).send(`All components should have an entry that is 2 to 250 characters long.`);
        return;
    }

    // Check if productID or name already exists
    let checkSql = `SELECT * FROM products WHERE productID = ? OR name = ?`;
    db.get(checkSql, [product.productID, product.name], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            res.status(400).send(`ProductID or name already exists.`);
            return;
        }

        // Insert the product into the database
        let insertSql = 'INSERT INTO products (productID, productType, name, price, quantity) VALUES (?, ?, ?, ?, ?)';
        db.run(insertSql, [product.productID, product.productType, product.name, price, product.quantity], (err) => {
            if (err) {
                throw err;
            }
            res.status(201).send(`Product ${product.productID} added.`);
        });
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
