const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
    {
        // checkin: {
        //     type: Date,
        //     required: [true, 'Checkin date is required']
        // },
        // checkout: {
        //     type: Date,
        //     required: [true, 'Checkout date is required']
        // },
        // amount: {
        //     type: Number,
        //     required: [true, 'Total amount is required ']
        // },
        // guests: {
        //     type: Number,
        //     required: [true, 'Number of guests is required']
        // },
        // nights: {
        //     type: Number,
        //     required: [true, 'Number of nights is required'],
        //     default: function () {
        //         const oneDay = 24 * 60 * 60 * 1000; // Giây trong một ngày
        //         return Math.round(Math.abs((this.checkout - this.checkin) / oneDay)); // Tự động tính số đêm
        //     },
        // },
        adults: {
            type: Number,
            default:1,
        },
        children: {
            type: Number,
            default: 0
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        rooms: [
            {
                roomId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Room',
                    required: true,
                },
                checkin: {
                    type: Date,
                    required: true,
                },
                checkout: {
                    type: Date,
                    required: true,
                }
            }
        ],
        paid: {
            type: Boolean,
            default: false // Đơn đặt phòng chưa thanh toán
        },
        status: {
            type: String,
            enum: ["đã đặt", "đã nhận", "thanh toán"], // Trạng thái đặt phòng: đang hoạt động, đã hoàn thành, hoặc đã huỷ
            default: "đã đặt"
        }

    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;