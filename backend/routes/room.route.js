const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const roomController = require('../controllers/room.controller.js');
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


router.post("/", roomController.addRoom); // Thêm mới một phòng
router.get("/", roomController.getRooms);
router.get("/", roomController.getAllRooms);
router.get("/date/:date", roomController.getRooms);
router.post("/manager",upload.single('image'), roomController.createRoom); // Lấy danh sách tất cả phòng // Lấy danh sách tất cả phòng
router.put("/manager/:id", roomController.updateRooms);
router.delete("/manager/:id", roomController.deleteRoomById);

router.get("/:id", roomController.getRoomByUserId);



router.put("/:id", roomController.updateRooms);
router.get("/:id", roomController.getRoomById); // Lấy danh sách tất cả phòng
router.put("/:id", roomController.updateRoom); // Cập nhật thông tin của một phòng
router.delete("/:id", roomController.deleteRoom); // Xóa một phòng



module.exports = router;