const Review = require("../models/review.model.js");
// const Order = require("../models/order.model.js");
// const Booking = require("../models/booking.model.js");
// const MenuItem = require("../models/menu.model.js");
const mongoose = require('mongoose');

// Tạo đơn hàng và liên kết với booking
const createReview = async (req, res) => {
    try {
        // Extract data from the request body
        const { booking, customer, rating, noidung, phanhoi } = req.body;

        // Validate required fields
        if (!booking || !customer || rating === undefined) {
            return res.status(400).json({
                message: "Booking, Customer, and Rating are required fields.",
            });
        }

        // Create the review
        const review = await Review.create({
            booking,
            customer,
            rating,
            noidung,
            phanhoi,
        });

        // Respond with the created review
        res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error.message || error);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message || error,
        });
    }
};

const getReviewById = async (req, res) => {
    try {
        const { customerId } = req.params;
        const review = await Review.find({ customer: customerId }).populate('customer');
        res.status(200).json(review);
    } catch (error) {
        console.error("Error creating review:", error.message || error);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message || error,
        });
        
    }
}

const getAllReview = async (req, res) => {
    try {
        const review = await Review.find().populate('customer');
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get review",
            error: error.message || error,
        });
    }
}



module.exports = {
  createReview,
  getReviewById,
  getAllReview
};
