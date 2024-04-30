//AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

const validProductTypes = ["Bumpers", "Suspension", "BrakePads", "Clutches", "Engine", "Catalyst", "Downpipes", "Wheels", "InteriorTrim", "Tires"];

function addProductToDatabase(db, product, res) {
    // Validation checks
    if (!/^P\d{16}$/.test(product.productID)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Product ${product.productID} not added: Invalid productID format.`);
        return;
    }
    if (!validProductTypes.includes(product.productType)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Product ${product.productID} not added: Invalid productType.`);
        return;
    }
    // Validate the price format
    price = product.price;
    if (!/^\$\d+\.\d{2}$/.test(product.price)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`Product ${product.productID} not added: Invalid price format.`);
      return;
    }
    if (!Number.isInteger(product.quantity) || product.quantity < 0) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Product ${product.productID} not added: Invalid quantity.`);
        return;
    }
    if (Object.values(product).some(value => value.length < 2 || value.length > 250)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Product ${product.productID} not added: All components should have an entry that is 2 to 250 characters long.`);
        return;
    }

    // Check if productID or name already exists
    const checkSql = `SELECT * FROM products WHERE productID = ? OR name = ?`;
    db.get(checkSql, [product.productID, product.name], (err, row) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error checking product: ${err.message}`);
            return;
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
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Error adding product: ${err.message}`);
                return;
            }
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end(`Product ${product.productID} added.`);
        });
    });
}

module.exports = { addProductToDatabase };

