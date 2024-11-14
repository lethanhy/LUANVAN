
const Invoice = require("../models/invoice.model.js");
const Booking = require("../models/booking.model");
const Room = require("../models/room.model.js");
const Staff = require("../models/staff.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const create = async (req, res) => {
    try {
        // Nhận dữ liệu từ req.body
        const { booking, totalAmount } = req.body;

        // Kiểm tra nếu các trường cần thiết không có
        if (!booking || !totalAmount) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo hóa đơn.' });
        }

        // Tạo mới một hóa đơn
        const invoice = await Invoice.create({
            booking,
            totalAmount,
        });

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error);
        res.status(500).json({ message: 'Lỗi khi tạo hóa đơn. Vui lòng thử lại.' });
    }
};
const getAllInvoice = async (req, res) => {
    try {
        // Populate `booking` và sâu thêm vào `customer`
        const invoices = await Invoice.find().populate({
            path: 'booking',
            populate: [
                {
                  path: 'customer', // Populate customer info
                },
                {
                  path: 'room', // Populate room info
                },
                {
                    path: 'staff', // Populate room info
                },
              ],
        });

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn. Vui lòng thử lại.' });
    }
};



module.exports = {
    create,
    getAllInvoice
    
};