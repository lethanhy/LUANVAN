const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const bookingController = require('../controllers/booking.controller.js');
const auth = require('../middleware/auth.js');


// Tạo một booking mới (yêu cầu xác thực)
router.post('/', auth, bookingController.createBooking);

// Lấy tất cả các booking (yêu cầu xác thực)
router.get('/', auth, bookingController.getBookings);

module.exports = router;