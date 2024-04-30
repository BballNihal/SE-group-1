//AUTHOR: NIHAL ABDUL MUNEER

const sqlite3 = require('sqlite3').verbose();

function validateProduct(product) {
    // Validate the product data
    if (!/^P\d{16}$/.test(product.productID)) {
        return 'Invalid productID format.';
    }
    const validProductTypes = ["Bumpers", "Suspension", "BrakePads", "Clutches", "Engine", "Catalyst", "Downpipes", "Wheels", "InteriorTrim", "Tires"];
    if (!validProductTypes.includes(product.productType)) {
        return 'Invalid productType.';
    }
    // Remove commas from the price and validate the format
    const price = product.price.replace(/,/g, '');
    if (!/^\$\d+(\.\d+)?$/.test(price)) {
        return 'Invalid price format.';
    }
    if (!Number.isInteger(product.quantity) || product.quantity < 0) {
        return 'Invalid quantity.';
    }
    if (Object.values(product).some(value => value.length < 2 || value.length > 250)) {
        return 'All components should have an entry that is 2 to 250 characters long.';
    }
    return null; // Validation successful
}

module.exports = { validateProduct };
