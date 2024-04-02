//AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

function deleteProductFromDatabase(db, req, res) {
    const productID = req.body.productID; // Retrieve productID from the request body

    if (!productID) {
        res.status(400).send('Product ID is missing in the request body');
        return;
    }

    // Delete the product from the database
    const deleteSql = 'DELETE FROM products WHERE productID = ?';
    db.run(deleteSql, [productID], (err) => {
        if (err) {
            throw err;
        }
        res.send(`Product ${productID} deleted.`);
    });
}

module.exports = { deleteProductFromDatabase };