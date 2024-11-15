
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

// Hàm tính tổng doanh thu
const calculateTotalRevenue = async (req, res) => {
    try {
      const result = await Invoice.aggregate([
        {
          $match: {
            paymentStatus: 'Paid' // Chỉ lấy những hóa đơn đã thanh toán
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' } // Tính tổng trường `totalAmount`
          }
        }
      ]);
  
      // Kiểm tra nếu kết quả tồn tại và trả về tổng doanh thu, ngược lại trả về 0
      const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    //   console.log(`Tổng doanh thu từ các hóa đơn đã thanh toán là: ${totalRevenue} VND`);
     res.status(200).json(totalRevenue)
    } catch (error) {
      console.error('Lỗi khi tính tổng doanh thu:', error);
      res.status(500).json('Lỗi')
    }
  };

  const calculateMonthlyRevenue = async (req, res) => {
    try {
      const result = await Invoice.aggregate([
        {
          $match: {
            paymentStatus: 'Paid' // Chỉ lấy các hóa đơn đã thanh toán
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$issuedDate" } }, // Nhóm theo tháng
            totalRevenue: { $sum: '$totalAmount' } // Tính tổng tiền
          }
        },
        {
          $sort: { _id: 1 } // Sắp xếp theo tháng tăng dần
        }
      ]);
  
    //   console.log('Tổng doanh thu theo tháng:', result);
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi tính tổng doanh thu theo tháng:', error);
      return [];
    }
  };

  const calculateDailyRevenue = async (req, res) => {
    try {
      const result = await Invoice.aggregate([
        {
          $match: {
            paymentStatus: 'Paid' // Chỉ lấy các hóa đơn đã thanh toán
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$issuedDate" } }, // Nhóm theo ngày
            totalRevenue: { $sum: '$totalAmount' } // Tính tổng tiền
          }
        },
        {
          $sort: { _id: 1 } // Sắp xếp theo ngày tăng dần
        }
      ]);
  
    //   console.log('Tổng doanh thu theo ngày:', result);
      res.status(200).json(result)
    } catch (error) {
      console.error('Lỗi khi tính tổng doanh thu theo ngày:', error);
      return [];
    }
  };
  
  
  
  


module.exports = {
    create,
    getAllInvoice,
    calculateTotalRevenue,
    calculateMonthlyRevenue,
    calculateDailyRevenue
    
};