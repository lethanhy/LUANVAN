const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const bookingController = require('../controllers/booking.controller.js');
const auth = require('../middleware/auth.js');


// Tạo một booking mới (yêu cầu xác thực)
router.post('/order', bookingController.createBooking);
router.post('/order/cart', bookingController.addCart);
router.get('/order/cart', bookingController.getCart);
router.get('/order', bookingController.getRoomByAvailable);


// Xem chi tiết một booking (yêu cầu xác thực)
router.get('/:id', auth, bookingController.getBookingId);

// Cập nhật một booking (yêu cầu xác thực)
router.patch('/:id', auth, bookingController.updateBooking);

// Xóa một booking (yêu cầu xác thực)
router.delete('/:id', auth, bookingController.deleteBooking);

router.delete('/order/:id', bookingController.deleteCart);

module.exports = router;