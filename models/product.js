const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './customerService.db');


let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error('Error opening database', err);
    else console.log('Connected to the SQLite database at', dbPath);
});

// Define the path to the transaction database
const dbPath2 = path.resolve(__dirname, 'path/to/transactionData.db');

// Create the database connection
let transactiondb = new sqlite3.Database(dbPath2, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the transaction database.');
    }
});

exports.addReview = (memberId, productId, reviewContent, callback) => {
    const sql = `INSERT INTO ProductReviews (MemberID, ProductID, ReviewContent) VALUES (?, ?, ?)`;
    db.run(sql, [memberId, productId, reviewContent], function(err) {
        if (err) {
            console.error("Error inserting review into the database:", err);
            callback(err, null);
        } else {
            console.log(`A new review has been inserted with rowid ${this.lastID}`);
            callback(null, this.lastID);
        }
    });
};

exports.updateReview = (reviewId, newContent, callback) => {
    const sql = `UPDATE ProductReviews SET ReviewContent = ? WHERE ReviewID = ?`;
    db.run(sql, [newContent, reviewId], function(err) {
        if (err) {
            console.error("Error updating review in database:", err);
            callback(err);
        } else {
            console.log(`Review with ID ${reviewId} has been updated.`);
            callback(null, { message: 'Review updated successfully' });
        }
    });
};

exports.removeReview = (reviewId, callback) => {
    const sql = `DELETE FROM ProductReviews WHERE ReviewID = ?`;
    db.run(sql, [reviewId], function(err) {
        if (err) {
            console.error("Error deleting review from database:", err);
            callback(err);
        } else {
            console.log(`Review with ID ${reviewId} has been deleted.`);
            callback(null, { message: 'Review deleted successfully' });
        }
    });
};

exports.getReviewDetails = (reviewId, callback) => {
    const sql = 'SELECT * FROM ProductReviews WHERE ReviewID = ?';
    db.get(sql, [reviewId], (err, review) => {
        if (err) {
            console.error("Error fetching review details:", err);
            callback(err);
            return;
        }
        if (!review) {
            callback(null, null); // No review found, return null to indicate absence
        } else {
            console.log(`Review details fetched for ID ${reviewId}.`);
            callback(null, review);
        }
    });
};

exports.getDeliveryStatus = (memberId, productId, callback) => {
    // Connecting to the external database (assumed to be already configured)
    const sql = 'SELECT deliveryStatus FROM transactions WHERE productId = ? AND memberId = ?';
    transactiondb.get(sql, [productId, memberId], (err, row) => {
        if (err) {
            callback(err, null);
        } else if (row) {
            callback(null, row.deliveryStatus);
        } else {
            callback(null, null); // No data found
        }
    });
};

