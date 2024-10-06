const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const staffController = require('../controllers/staff.controller.js');
const auth = require('../middleware/auth.js');



router.post("/", staffController.addStaff); // Thêm mới một phòng
router.get("/", staffController.getStaff); // Lấy danh sách tất cả phòng
router.get("/:id", staffController.getStaffById); // Xóa một phòng

router.put("/:id", staffController.updateStaff); // Cập nhật thông tin của một phòng
router.delete("/:id", staffController.deleteStaff); // Xóa một phòng
// Đăng ký
router.post('/register', staffController.register);
// Đăng nhập
router.post('/login', staffController.login);

module.exports = router;