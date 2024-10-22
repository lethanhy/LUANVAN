const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        // danhgia: {
        //     type: String,
        //     trim: true, // Removes unnecessary spaces from input
        // },
        rating: {
            type: Number,
            required: true, // Ensure rating is provided
            min: 0, // Minimum value
            max: 5, // Maximum value
        },
        noidung: {
            type: String,
            trim: true,
        },
        phanhoi: {
            staff: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Staff",
            },
            noidung: {
                type: String,
                trim: true,
            },
            phanhoiAt: {
                type: Date, // Timestamp for the staff response
            },
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Index for faster queries on customer, booking, or staff fields
ReviewSchema.index({ customer: 1, booking: 1, "phanhoi.staff": 1 });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
