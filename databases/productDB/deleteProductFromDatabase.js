//AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

function deleteProductFromDatabase(db, productID, res) {
    if (!productID) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Product ID is missing in the request body');
      return;
    }
  
    // Delete the product from the database
    const deleteSql = 'DELETE FROM products WHERE productID = ?';
    db.run(deleteSql, [productID], (err) => {
      if (err) {
        throw err;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Product ${productID} deleted.`);
    });
  }

module.exports = { deleteProductFromDatabase };