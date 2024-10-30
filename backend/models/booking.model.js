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
        adults: {
            type: Number,
            default:1,
        },
        children: {
            type: Number,
            default: 0
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            // required: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        paid: {
            type: Boolean,
            default: false // Đơn đặt phòng chưa thanh toán
        },
        payment: {
            type: String,
            enum: ["Thanh toán ngân hàng","Thanh toán tiền mặt"], // Trạng thái thanh toán: ngân hàng, tiền mặt  
        },

        status: {
            type: String,
            enum: ["đã đặt", "đã nhận", "thanh toán","hoàn thành", "đã hủy", "chờ xác nhận"], // Trạng thái đặt phòng: đang hoạt động, đã hoàn thành, hoặc đã huỷ
            default: "đã đặt"
        },
        orders: [
            {
              itemName: String,
              quantity: Number,
              price: Number
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;