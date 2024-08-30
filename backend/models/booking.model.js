const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
    {
        checkin: {
            type: Date,
            required: [true, 'Checkin date is required']
        },
        checkout: {
            type: Date,
            required: [true, 'Checkout date is required']
        },
        amount: {
            type: Number,
            required: [true, 'Total amount is required ']
        },
        guests: {
            type: Number,
            required: [true, 'Number of guests is required']
        },
        nights: {
            type: Number,
            required: [true, 'Number of nights is required']
        },
        adults: {
            type: Number,
        },
        children: {
            type: Number,
            default: 0
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;