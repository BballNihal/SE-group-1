/*
This is an implementation of admins' capabilities of adding, editing, and deleting products from product database
Currently this code does not check for user having admin status
Plan is for that to be implemented via the front end

AUTHOR: NIHAL ABDUL MUNEER
*/

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 3000;
const { getProducts } = require('./getProducts'); 
const { validateProduct } = require('./validateProduct');
const { addProductToDatabase } = require('./addProductToDatabase');
const { deleteProductFromDatabase } = require('./deleteProductFromDatabase');
const { updateProductQuantity } = require('./updateProductQuantity')

app.use(express.json()); // for parsing application/json

// Open the database
let db = new sqlite3.Database('databases/productDB/products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the products database.');
});

app.get('/products', (req, res) => {
    //if the get products is sent without a body, then all products in db will be fetched. If sent with a body that specifies the product ID, then only that product will be fetched.
    getProducts(req, res, req.body); 
});


app.post('/products', (req, res) => {
    const product = req.body;

    const validationError = validateProduct(product);
    if (validationError) {
        res.status(400).send(validationError);
        return;
    }

    addProductToDatabase(db, product, res);
});


app.delete('/products', (req, res) => {
    deleteProductFromDatabase(db, req, res);
});

app.put('/products', (req, res) => {
    updateProductQuantity(db, req, res);
});



app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
