//AUTHOR: NIHAL ABDUL MUNEER
const sqlite3 = require('sqlite3').verbose();

function updateProductQuantity(db, req, res) {
    const productID = req.body.productID; // Retrieve productID from the request body
    const change = req.body.change; // Input will be like: "change": -4

    if (!Number.isInteger(change)) {
        res.status(400).send(`Invalid change value. It must be an integer number.`);
        return;
    }

    // Fetch the current quantity from the database
    const selectSql = `SELECT quantity FROM products WHERE productID = ?`;
    db.get(selectSql, [productID], (err, row) => {
        if (err) {
            throw err;
        }
        if (!row) {
            res.status(404).send(`Product ${productID} not found.`);
            return;
        }

        const currentQuantity = row.quantity;
        const newQuantity = currentQuantity + change;

        if (newQuantity < 0) {
            res.status(400).send(`Invalid quantity. The resulting quantity cannot be negative.`);
            return;
        }

        // Update the product quantity in the database
        const updateSql = `UPDATE products SET quantity = ? WHERE productID = ?`;
        db.run(updateSql, [newQuantity, productID], (err) => {
            if (err) {
                throw err;
            }
            res.send(`Product ${productID} updated. New quantity: ${newQuantity}.`);
        });
    });
}

module.exports = { updateProductQuantity };
