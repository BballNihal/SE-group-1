const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const productModel = require('../models/product'); // Assume this model handles database interactions for products
const productdbFilePath = path.join(__dirname, '..', 'databases', 'productDB', 'products.db');
const memberdbFilePath = path.join(__dirname, '..', 'databases', 'memberData.db');
let productdb = new sqlite3.Database(productdbFilePath);
let memberdb = new sqlite3.Database(memberdbFilePath);

// Function to check if a user is a guest (you might adjust the logic as per your user system)
const isGuestUser = (userId) => parseInt(userId, 10) === 0;
const guestErrorMessage = { error: "Guest users don't have permission for this action" };

// exports.submitReview = (req, res) => {
//     const { MemberID, ProductID, ReviewContent } = req.body;
//     if (isGuestUser(MemberID)) {
//         res.writeHead(403);
//         return res.end(JSON.stringify(guestErrorMessage));
//     }
//     productModel.addReview(MemberID, ProductID, ReviewContent, (err, reviewId) => {
//         if (err) {
//             res.statusCode = 500;
//             res.end(JSON.stringify({ error: "Failed to submit review", details: err }));
//         } else {
//             res.statusCode = 201;
//             res.end(JSON.stringify({ message: "Review submitted successfully", reviewId: reviewId }));
//         }
//     });
// };

exports.submitReview = (req, res) => {
    const { MemberID, ProductID, ReviewContent } = req.body;

    // Check if the user is a guest
    if (isGuestUser(MemberID)) {
        res.writeHead(403);
        return res.end(JSON.stringify(guestErrorMessage));
    }

    // Check if the member ID exists in the members database
    memberdb.get('SELECT * FROM members WHERE memberID = ?', [MemberID], (memberErr, memberRow) => {
        if (memberErr || !memberRow) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Member not found" }));
        }

        // Check if the product ID exists in the products database
        productdb.get('SELECT * FROM products WHERE productID = ?', [ProductID], (productErr, productRow) => {
            if (productErr || !productRow) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: "Product not found" }));
            }

            // If both member and product exist, add the review
            productModel.addReview(MemberID, ProductID, ReviewContent, (err, reviewId) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: "Failed to submit review", details: err }));
                } else {
                    res.statusCode = 201;
                    res.end(JSON.stringify({ message: "Review submitted successfully", reviewId: reviewId }));
                }
            });
        });
    });
};

exports.editReview = (req, res) => {
    const { ReviewID, MemberID, NewContent } = req.body;
    if (isGuestUser(MemberID)) {
        res.writeHead(403);
        return res.end(JSON.stringify(guestErrorMessage));
    }

    // Check if the member ID exists in the members database
    memberdb.get('SELECT * FROM members WHERE memberID = ?', [MemberID], (memberErr, memberRow) => {
        if (memberErr || !memberRow) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Member not found" }));
        }
    
        productModel.updateReview(ReviewID, NewContent, (err) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Failed to edit review", details: err }));
            } else {
                res.statusCode = 200;
                res.end(JSON.stringify({ message: "Review updated successfully" }));
            }
        }); // Close the callback for productModel.updateReview
    }); // Close the callback for memberdb.get
}; // Close the export


exports.deleteReview = (req, res) => {
    const { ReviewID, MemberID } = req.query;
    if (isGuestUser(MemberID)) {
        res.writeHead(403);
        return res.end(JSON.stringify(guestErrorMessage));
    }

    // Check if the member ID exists in the members database
    memberdb.get('SELECT * FROM members WHERE memberID = ?', [MemberID], (memberErr, memberRow) => {
        if (memberErr || !memberRow) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Member not found" }));
        }

        productModel.removeReview(ReviewID, (err) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Failed to delete review", details: err }));
            } else {
                res.statusCode = 200;
                res.end(JSON.stringify({ message: "Review deleted successfully" }));
            }
        });
    }); // Close the callback for memberdb.get
}; // Close the export

