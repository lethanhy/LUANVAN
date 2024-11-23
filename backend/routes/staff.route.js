const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const staffController = require('../controllers/staff.controller.js');
const auth = require('../middleware/auth.js');

const multer = require('multer');
// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Nơi lưu trữ hình ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
    }
});

const upload = multer({ storage: storage });



router.post("/", staffController.addStaff); // Thêm mới một phòng
router.post("/changePassword", staffController.changePassword); // Thêm mới một phòng
router.get("/", staffController.getStaff); // Lấy danh sách tất cả phòng
router.get("/role", staffController.getStaffByRole);
router.get("/:id", staffController.getStaffById); // Xóa một phòng

router.put("/:id", staffController.updateStaff); // Cập nhật thông tin của một phòng
router.delete("/:id", staffController.deleteStaff); // Xóa một phòng
// Đăng ký
router.post('/register', staffController.register);
// Đăng nhập
router.post('/login', staffController.login);

router.put('/:staffId/upload-image', upload.single('image'),staffController.uploadProfileImage);

module.exports = router;