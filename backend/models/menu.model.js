const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MenuSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        price: {
            type: Number,
        } 
    },
    {
        timestamps: true,
    }
);

const MenuItem = mongoose.model("MenuItem", MenuSchema);

module.exports = MenuItem;