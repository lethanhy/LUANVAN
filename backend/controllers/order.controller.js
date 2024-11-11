const Room = require("../models/room.model.js");
const Order = require("../models/order.model.js");
const Booking = require("../models/booking.model.js");
const MenuItem = require("../models/menu.model.js");
const mongoose = require('mongoose');

// Tạo đơn hàng và liên kết với booking
// const createOrder = async (req, res) => {
//   try {
//       const { bookingId, items } = req.body;

//       // Validate that there are items in the order
//       if (!items || !items.length) {
//           return res.status(400).json({ message: 'No items in the order' });
//       }

//       // Find the booking by its ID
//       const booking = await Booking.findById(bookingId);

//       if (!booking) {
//           return res.status(404).json({ message: 'Booking not found' });
//       }

//       // Add new items to the booking's orders
//       items.forEach(item => {
//           booking.orders.push({
//               id: item._id,
//               itemName: item.itemName,
//               quantity: item.quantity,
//               price: item.price
//           });
//       });

//       // Save the updated booking with new orders
//       await booking.save();

//       res.status(200).json({ message: 'Order added successfully', orders: booking.orders });
//   } catch (error) {
//       console.error('Error creating order:', error.message || error);
//       res.status(500).json({ message: 'Failed to create order', error: error.message || error });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const { bookingId, items } = req.body;

    console.log("Received items:", items);  // Debug log

    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items in the order' });
    }

    // Find the booking by its ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    for (let item of items) {
      console.log("Item ID:", item._id);  // Debug log for ID

      // Ensure you're consistent with the ID key: _id or id
      const menuItem = await MenuItem.findById(item._id);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found for item ID: ${item._id}` });
      }

      // Check if enough stock is available
      if (menuItem.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.itemName}. Available quantity: ${menuItem.quantity}` });
      }

      // Reduce the menu item quantity
      menuItem.quantity -= item.quantity;
      await menuItem.save();

      // Add the item to the booking's orders
      booking.orders.push({
        id: menuItem._id,
        itemName: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Save the updated booking
    await booking.save();

    res.status(200).json({ message: 'Order added successfully', orders: booking.orders });
  } catch (error) {
    console.error('Error creating order:', error.message || error);
    res.status(500).json({ message: 'Failed to create order', error: error.message || error });
  }
};



const getOrder = async (req, res) => {
    try {
      const { roomId } = req.params; // Nhận roomId từ params
  
      // Kiểm tra định dạng roomId
      if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: 'roomId không hợp lệ.' });
      }
  
      // Tìm các đơn hàng theo roomId
      const orders = await Booking.find({ roomId }).populate('orders');
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào.' });
      }
  
      res.json(orders);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy đơn hàng.' });
    }
  };
  


module.exports = {
  createOrder,
  getOrder
};
