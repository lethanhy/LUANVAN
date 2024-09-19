const Room = require("../models/room.model.js");
const Order = require("../models/order.model.js");
const Booking = require("../models/booking.model.js");
const MenuItem = require("../models/menu.model.js");
const mongoose = require('mongoose');

// Tạo đơn hàng và liên kết với booking
const createOrder = async (req, res) => {
  try {
    const { roomId, customerId, bookingId, items } = req.body;

    // Kiểm tra xem dữ liệu đầu vào có đầy đủ không
    if (!roomId || !customerId || !bookingId || !items || items.length === 0) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    // Tính tổng số tiền cho đơn hàng
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      // Nếu không tìm thấy món ăn trong cơ sở dữ liệu
      if (!menuItem) {
        return res.status(404).json({ message: `Món ăn với ID ${item.menuItem} không tồn tại` });
      }

      totalAmount += menuItem.price * item.quantity;
    }

    // Tìm booking trước khi tạo đơn hàng để kiểm tra xem booking có tồn tại không
    const booking = await Booking.findById(bookingId);

    // Nếu không tìm thấy booking
    if (!booking) {
      return res.status(404).json({ message: `Không tìm thấy booking với ID ${bookingId}` });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      roomId,
      customerId,
      bookingId, // Liên kết với booking
      items,
      totalAmount,
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    // Thêm đơn hàng vào danh sách đơn hàng của booking đó
    booking.orders.push(newOrder._id);
    await booking.save();

    res.status(201).json({ message: 'Đơn hàng đã được tạo và liên kết với booking', order: newOrder });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tạo đơn hàng' });
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
      const orders = await Order.find({ roomId }).populate('items.menuItem');
  
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
