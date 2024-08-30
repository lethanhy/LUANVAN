const express = require("express");
// const Booking = require("../models/booking.model.js");
const router = express.Router();
const roomController = require('../controllers/room.controller.js');
const auth = require('../middleware/auth.js');



router.post("/", roomController.addRoom); // Thêm mới một phòng
router.get("/", roomController.getRooms); // Lấy danh sách tất cả phòng
router.put("/:id", roomController.updateRoom); // Cập nhật thông tin của một phòng
router.delete("/:id", roomController.deleteRoom); // Xóa một phòng

module.exports = router;