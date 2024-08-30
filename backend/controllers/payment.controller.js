const Payment = require("../models/payment.model.js");
const Booking = require("../models/booking.model.js");
const Customer = require("../models/customer.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const createPayment = async (req, res) => {
    try {
        const { bookingId, customerId, amount, method } = req.body;

        // Kiểm tra xem booking và customer có tồn tại không
        const booking = await Booking.findById(bookingId);
        const customer = await Customer.findById(customerId);

        if(!booking){
            return res.status(404).send({message: "Booking not found"});
        }

        if(!customer){
            return res.status(404).send({message: "Customer not found"});
        }

        // Tạo thanh toán mới
        const payment = new Payment({
            bookingId,
            customerId,
            amount,
            method,
            status: 'Pending', // Trạng thái mặt định
        });
        await payment.save();
        res.status(201).send(payment);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Lấy thông tin thanh toán theo Id
// Lấy tất cả thanh toán
// Cập nhật trạng thái thanh toán
// Xóa thanh toán theo Id

module.exports = {
    createPayment
    
};