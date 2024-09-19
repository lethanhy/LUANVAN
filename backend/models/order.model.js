const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Liên kết với booking
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Đảm bảo trường này đã được định nghĩa
        items: [
          {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            quantity: { type: Number, required: true }
          }
        ],
        totalAmount: { type: Number, required: true },
        orderDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
    },
);



const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;