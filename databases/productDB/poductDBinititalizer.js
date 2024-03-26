const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Read the products from the file
const products = JSON.parse(fs.readFileSync('databases/productDB/products.txt', 'utf8'));

// Create a new database (or open it if it already exists)
let db = new sqlite3.Database('databases/productDB/products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the products database.');
});

// Create a new table for the products
db.run(`CREATE TABLE products (
    productID TEXT PRIMARY KEY,
    productType TEXT,
    name TEXT,
    price TEXT,
    quantity INT
)`, (err) => {
  if (err) {
    // Table already created
  } else {
    // Table just created, creating some rows
    let insert = 'INSERT INTO products (productID, productType, name, price, quantity) VALUES (?, ?, ?, ?, ?)';
    let validProductTypes = ["Bumpers", "Suspension", "BrakePads", "Clutches", "Engine", "Catalyst", "Downpipes", "Wheels", "InteriorTrim", "Tires"];
    products.forEach(product => {
      // Validate the product data
      if (!/^P\d{5}$/.test(product.productID)) {
        console.log(`Product ${product.productID} not added: Invalid productID format.`);
        return;
      }
      if (!validProductTypes.includes(product.productType)) {
        console.log(`Product ${product.productID} not added: Invalid productType.`);
        return;
      }
      // Remove commas from the price and validate the format
      let price = product.price.replace(/,/g, '');
      if (!/^\$\d+(\.\d+)?$/.test(price)) {
        console.log(`Product ${product.productID} not added: Invalid price format.`);
        return;
      }
      if (!Number.isInteger(product.quantity) || product.quantity < 0) {
        console.log(`Product ${product.productID} not added: Invalid quantity.`);
        return;
      }
      if (Object.values(product).some(value => value.length < 2 || value.length > 250)) {
        console.log(`Product ${product.productID} not added: All components should have an entry that is 2 to 250 characters long.`);
        return;
      }
      // Insert the product into the database
      db.run(insert, [product.productID, product.productType, product.name, price, product.quantity], (err) => {
        if (err) {
          console.log(`Product ${product.productID} not added: ${err.message}`);
        }
      });
    });
  }
});

