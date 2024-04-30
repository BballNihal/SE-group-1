// AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

function deleteProductFromDatabase(db, productID, res) {
    if (!productID) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Product ID is missing in the request body');
        return;
    }

    // Check if the product exists
    db.get('SELECT * FROM products WHERE productID = ?', [productID], (err, row) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error checking product ${productID}: ${err.message}`);
            return;
        }
        if (!row) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Product ${productID} does not exist.`);
            return;
        }

        // Delete the product from the database
        const deleteSql = 'DELETE FROM products WHERE productID = ?';
        db.run(deleteSql, [productID], (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Error deleting product ${productID}: ${err.message}`);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Product ${productID} deleted.`);
        });
    });
}

module.exports = { deleteProductFromDatabase };
