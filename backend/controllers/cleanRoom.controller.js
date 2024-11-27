
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
            roomStatus:'Phân công',
            status: 'Phân công',  // Trạng thái phân công
        });

        await cleanRoom.save();

        // Cập nhật trạng thái phòng
        await Room.findByIdAndUpdate(roomId, { trangthai: 'Phân công' });

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

      // Cập nhật trạng thái CleanRoom
      cleanroom.status = "Hoàn thành";
      cleanroom.roomStatus = "Đã dọn dẹp";
      await cleanroom.save(); // Lưu thay đổi

      res.status(200).json({ message: "Cập nhật trạng thái phòng thành công!" });
  } catch (error) {
      res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái phòng", error });
  }
};


const updateClean = async (req, res) => {
  const { cleanroomId } = req.params;
  const { status } = req.body;

  // console.log('Received cleanroomId:', cleanroomId); // Ghi log ID để kiểm tra


  try {
    // Tìm kiếm phòng được phân công dựa trên cleanroomId, đảm bảo trạng thái không phải 'Đã dọn dẹp'
    const assignment = await CleanRoom.findOne({ 
      _id: cleanroomId, 
      status: { $nin: ['Đã dọn dẹp'] } 
    }).populate('room');

    if (!assignment) {
      return res.status(404).json({ message: 'Không tìm thấy phân công' }); // 404 - Không tìm thấy
    }

    // Cập nhật trạng thái của phòng
    assignment.room.trangthai = status;
    await assignment.room.save();

    // Cập nhật trạng thái của phân công
    assignment.status = 'Đang dọn dẹp';
    assignment.roomStatus = 'Đang dọn dẹp';
    await assignment.save(); // Gọi hàm save()

    res.status(200).json({ message: 'Cập nhật trạng thái phòng thành công' }); // 200 - Thành công
  } catch (err) {
    console.error(err); // Tuỳ chọn: ghi lỗi vào server để theo dõi
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái phòng' }); // 500 - Lỗi server
  }
};

const updateCleanMobile = async (req, res) => {
  const { cleanroomId } = req.params;
  const { status } = req.body;

  // Validate the status value (Uncomment and adjust as needed)
  const validStatuses = ['Phân công', 'Đang dọn dẹp', 'Đã dọn dẹp']; // Add more statuses as necessary
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' }); // 400 - Bad Request
  }

  try {
    // Find the room assignment by cleanroomId
    const assignment = await CleanRoom.findById(
      cleanroomId).populate('room');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' }); // 404 - Not Found
    }

    // Update the room status
    assignment.room.trangthai = status;
    await assignment.room.save(); // Ensure the room status is saved correctly

    // Update the assignment status
    assignment.status = status;
    assignment.roomStatus = status;
    await assignment.save(); // Ensure the assignment status is saved correctly

    res.status(200).json({ message: 'Room status updated successfully' }); // 200 - OK
  } catch (err) {
    console.error(err); // Optional, to log the error on the server
    res.status(500).json({ message: 'Error updating room status' }); // 500 - Internal Server Error
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
    updateRoomStatus,
    updateClean,
    updateCleanMobile
//    createCleanRoom,
//    assignRoomToStaff
//    getAllContact,
//    deleteById,
    
};