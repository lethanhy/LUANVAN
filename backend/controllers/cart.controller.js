const Room = require("../models/room.model.js");
const Cart = require("../models/cart.model.js");


const addCart = async (req, res) => {
    try {
        const { checkin, checkout, roomId } = req.body;

        if (!checkin || !checkout || !roomId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const cart = new Cart({
            checkin,
            checkout,
            room: roomId,  // Ensure roomId is being passed correctly
        });

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error("Error while adding cart:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};







module.exports = {
   addCart,
   

};