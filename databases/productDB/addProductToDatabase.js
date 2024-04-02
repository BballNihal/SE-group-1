const sqlite3 = require('sqlite3').verbose();

function addProductToDatabase(db, product, res) {
    // Check if productID or name already exists
    const checkSql = `SELECT * FROM products WHERE productID = ? OR name = ?`;
    db.get(checkSql, [product.productID, product.name], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            res.status(400).send(`ProductID or name already exists.`);
            return;
        }

        // Insert the product into the database
        const insertSql = 'INSERT INTO products (productID, productType, name, price, quantity) VALUES (?, ?, ?, ?, ?)';
        db.run(insertSql, [product.productID, product.productType, product.name, product.price, product.quantity], (err) => {
            if (err) {
                throw err;
            }
            res.status(201).send(`Product ${product.productID} added.`);
        });
    });
}

module.exports = { addProductToDatabase };
