//AUTHOR: NIHAL ABDUL MUNEER
const sqlite3 = require('sqlite3').verbose();

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
module.exports = { updateProductQuantity };
