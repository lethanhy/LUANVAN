const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ContactSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            // required: true
        },
        ten: {
            type: String,
        },
        diachi: {
            type: String, 
        },
        sodienthoai: {
            type: Number,
        },
        email: {
            type: String, // Tiện nghi trong phòng, có thể là mảng các chuỗi
        },
        tinnhan: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;