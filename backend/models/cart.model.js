const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CartSchema = mongoose.Schema(
    {
        rooms: [
            {
                roomId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Room',
                    required: true
                },
                checkin: {
                    type: Date,
                    required: true
                },
                checkout: {
                    type: Date,
                    required: true
                }
            }
        ],
    },
    {
        timestamps: true,
    }
);



const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;