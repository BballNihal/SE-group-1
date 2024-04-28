const fs = require('fs');
const path = require('path');
const productModel = require('../models/product'); // Assume this model handles database interactions for products

// Function to check if a user is a guest (you might adjust the logic as per your user system)
const isGuestUser = (userId) => parseInt(userId, 10) === 0;
const guestErrorMessage = { error: "Guest users don't have permission for this action" };

exports.submitReview = (req, res) => {
    const { MemberID, ProductID, ReviewContent } = req.body;
    if (isGuestUser(MemberID)) {
        res.writeHead(403);
        return res.end(JSON.stringify(guestErrorMessage));
    }
    productModel.addReview(MemberID, ProductID, ReviewContent, (err, reviewId) => {
        if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to submit review", details: err }));
        } else {
            res.statusCode = 201;
            res.end(JSON.stringify({ message: "Review submitted successfully", reviewId: reviewId }));
        }
    });
};

exports.editReview = (req, res) => {
    const { ReviewID, MemberID, NewContent } = req.body;
    if (isGuestUser(MemberID)) {
        res.writeHead(403);
        return res.end(JSON.stringify(guestErrorMessage));
    }
    productModel.updateReview(ReviewID, NewContent, (err) => {
        if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to edit review", details: err }));
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Review updated successfully" }));
        }
    });
};

exports.deleteReview = (req, res) => {
    const { ReviewID, MemberID } = req.query;
    if (isGuestUser(MemberID)) {
        res.writeHead(403);
        return res.end(JSON.stringify(guestErrorMessage));
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
};
