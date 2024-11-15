const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Booking = require("./booking.model");

const InvoiceSchema = mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            // required: true
        },
        totalAmount: {
            type: Number,
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Paid'
          },
          paymentMethod: {
            type: String, // Phương thức thanh toán, ví dụ: VNPay, tiền mặt, thẻ tín dụng
        },
        issuedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;