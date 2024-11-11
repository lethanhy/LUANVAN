
const CleanRoom = require("../models/cleanRoom.model.js");
const Booking = require("../models/booking.model");
const Room = require("../models/room.model.js");
const Staff = require("../models/staff.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

// POST: Phân công phòng cho nhân viên
const cleanRoom = async (req, res) => {
    const { staffId, roomId } = req.body;
    try {
        const staff = await Staff.findById(staffId);
        const room = await Room.findById(roomId);
        
        if (!staff || !room) {
            return res.status(400).json({ message: 'Nhân viên hoặc phòng không hợp lệ.' });
        }

        // Tạo phân công
        const cleanRoom = new CleanRoom({
            staff: staffId,
            room: roomId,
            status: 'Phân công',  // Trạng thái phân công
        });

        await cleanRoom.save();

        // Cập nhật trạng thái phòng
        await Room.findByIdAndUpdate(roomId, { trangthai: 'Đang dọn dẹp' });

        res.status(200).json(cleanRoom);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi phân công phòng.' });
    }
};



// const assignRoomToStaff = async (req, res) => {
//     try {
//         const rooms = await Room.find({ trangthai: 'chưa dọn dẹp' }); // Lấy phòng chưa dọn
//         const staff = await Staff.find({ role: 'Dọn phòng'}); // Lấy tất cả nhân viên

//         // Phân công dọn phòng cho nhân viên đầu tiên (có thể tùy chỉnh logic phân công)
//         const assignments = rooms.map((room, index) => ({
//             staff: staff[index % staff.length]._id, // Cứ phân công cho nhân viên lần lượt
//             room: room._id,
//             status: 'Phân công', // Trạng thái phân công
//         }));

//         const assignedRooms = await CleanRoom.insertMany(assignments); // Lưu phân công vào cơ sở dữ liệu
//         res.status(200).json(assignedRooms);
//     } catch (error) {
//         res.status(500).json({ message: 'Có lỗi xảy ra khi phân công', error });
//     }
// };

const getCleanRoom = async (req, res) => {
    try {
        const result = await CleanRoom.find().populate('room').populate('staff');
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// updateRoomStatus: cập nhật trạng thái phòng thành "hoàn thành"
const updateRoomStatus = async (req, res) => {
    try {
      const { cleanroomId } = req.params;
  
      // Tìm CleanRoom và cập nhật trạng thái phòng
      const cleanroom = await CleanRoom.findById(cleanroomId).populate("room");
  
      if (!cleanroom) {
        return res.status(404).json({ message: "Không tìm thấy phân công phòng" });
      }
  
      // Cập nhật trạng thái phòng
      cleanroom.room.trangthai = "Đã dọn dẹp"; // Cập nhật trạng thái phòng
      await cleanroom.room.save(); // Lưu thay đổi
  
      res.status(200).json({ message: "Cập nhật trạng thái phòng thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái phòng", error });
    }
  };
// const deleteById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const contact = await Contact.findByIdAndDelete(id);
//         res.status(200).json({message:"Xóa thành công"})
//     } catch (error) {
//         res.status(400).send({ message: error.message });
//     }
// }


module.exports = {
    cleanRoom,
    getCleanRoom,
    updateRoomStatus
//    createCleanRoom,
//    assignRoomToStaff
//    getAllContact,
//    deleteById,
    
};