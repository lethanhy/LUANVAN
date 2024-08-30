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
            enum: ["single", "Double", "Suite"] // Loại phòng
        },
        price: {
            type: Number,
            require: [true, 'Room price is required'],
           
        },
        status: {
            type: String,
            enum: ["Available", "Booked", "Maintenance"], // Có sẵn, đã đặt, bảo trì
            default: "Available",

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
        }
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;