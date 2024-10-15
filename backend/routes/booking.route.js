const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const bookingController = require('../controllers/booking.controller.js');
const auth = require('../middleware/auth.js');


// Tạo một booking mới (yêu cầu xác thực)
router.get('/', bookingController.getBooking);
router.post('/order', bookingController.createBooking);
router.post('/order/user', bookingController.createBookingUser);

router.post('/order/cart', bookingController.addCart);
// router.get('/order/cart', bookingController.getCart);
router.get('/order', bookingController.getRoomByAvailable);

// Endpoint to get bookings by date
router.get('/date/:date', bookingController.getRoomDate);

router.delete('/:id', bookingController.deleteBookingById);


// Xem chi tiết một booking (yêu cầu xác thực)
router.get('/:id', bookingController.getBookingId);

// Xem chi tiết một booking (yêu cầu xác thực)
router.get('/user/:id', bookingController.getBookingUserId);

// Cập nhật một booking (yêu cầu xác thực)
router.put('/:id', bookingController.updateBooking);

// Cập nhật một booking (yêu cầu xác thực)
router.put('/rooms/:id', bookingController.updateRoom);

router.put('/rooms/booking/:id', bookingController.updateDeleteRoom);

// Xóa một booking (yêu cầu xác thực)
router.delete('/:id', auth, bookingController.deleteBooking);

router.delete('/order/:roomId', bookingController.deleteCart);



module.exports = router;