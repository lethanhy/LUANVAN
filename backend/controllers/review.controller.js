const Review = require("../models/review.model.js");
const Staff = require("../models/staff.model.js");
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

const getReviewByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const review = await Review.find({ customer: customerId }).populate('customer').populate('phanhoi.staff');
        res.status(200).json(review);
    } catch (error) {
        console.error("Error creating review:", error.message || error);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message || error,
        });
        
    }
}

// const getReviewByBooking = async (req, res) => {
//     try {
//         const { bookingId } = req.params;
//         const review = await Review.find({ booking: bookingId });
//         res.status(200).json(review);
//     } catch (error) {
//         console.error("Error creating review:", error.message || error);
//         res.status(500).json({
//             message: "Failed to create review",
//             error: error.message || error,
//         });
        
//     }
// }

const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id).populate('customer');
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
        const review = await Review.find().populate('customer').populate('phanhoi.staff');
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get review",
            error: error.message || error,
        });
    }
}

const feedbackCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { noidung, staff, phanhoiAt } = req.body;
    
        const review = await Review.findByIdAndUpdate(
          id,
          { phanhoi: { noidung, staff, phanhoiAt } },
          { new: true }
        );
    
        if (!review) {
          return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }
    
        res.json(review);
      } catch (error) {
        res.status(500).json({ message: 'Lỗi khi gửi phản hồi' });
      }
}

const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);

        res.status(200).json({ message: 'Xóa thành công'})
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi gửi xóa' });
    }
}



module.exports = {
  createReview,
  getReviewByCustomer,
  getAllReview,
  getReviewById,
  feedbackCustomer,
  deleteById,
//   getReviewByBooking
};
