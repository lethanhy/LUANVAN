const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Transaction } = require("mongodb");

const PaymentSchema = mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        amount: {
            type: Number,
            required: [true, "Payment amount is required"],
        },
        method: {
            type: String,
            required: [true, "Payment method is required"],
            enum: [ "Credit Card", "Debit", "Cash", "Bank Transfer", "Online"],
        },
        status: {
            type: String,
            required: [true, "Payment status is required"],
            enum: ["Pending", "completed", "Failed"],
            default: "Pending",
        },
        TransactionDate: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;