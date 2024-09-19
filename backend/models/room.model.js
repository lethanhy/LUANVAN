const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const RoomSchema = mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'Room number is required'],
            unique: true,
        },
        type: {
            type: String,
            required: [ true, 'Room type is required'],
            enum: ["single", "Double", "family"] // Loại phòng
        },
        price: {
            type: Number,
            require: [true, 'Room price is required'],
           
        },
        // available: {
        //     type: Boolean,
        //     default: true,
        // },
        status: {
            type: String,
            enum: ["trống", "đã đặt", "đã nhận"], // Có sẵn, đã đặt, bảo trì
            default: "trống",
        },
        trangthai: {
            type: String,
            enum: ["Chưa dọn dẹp","Đã dọn dẹp"],
            default: "Đã dọn dẹp",

        },
        rating: {
            type: Number,
        },
        amenities: {
            type: [String], // Tiện nghi trong phòng, có thể là mảng các chuỗi
        },
        description: {
            type: String,
        },
        maxGuests: {
            type: Number,
            required: [true, "Maximum number of guests is required"],
        },
        bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],  // Reference to Booking
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;