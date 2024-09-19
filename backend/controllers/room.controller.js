const Room = require("../models/room.model.js");
const Booking = require("../models/booking.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');



const createRoom = async (req, res) => {
    try {
        const { roomNumber,type,price,status,trangthai,maxGuests} = req.body;

        // Xác nhận dữ liệu đầu vào
        if (!roomNumber || !type || !price || !status || !trangthai || !maxGuests) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        const newRoom = new Room({
            roomNumber,
            type,
            price,
            status,
            trangthai,
            maxGuests,
        });

        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm phòng' });
    }
};
const addRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).send(room);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateRooms = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get the update data from the request body

        // Ensure that update data is present
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No update data provided' });
        }

        // Update room data
        const result = await Room.findByIdAndUpdate(id, updateData, { new: true });

        if (result) {
            res.status(200).json({ message: 'Room updated successfully', data: result });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }

    } catch (error) {
        console.error('Error updating room:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};


const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Tìm phòng theo ID
        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).send({ message: "Không tìm thấy phòng" });
        }

        // Cập nhật các trường khác trong phòng
        Object.assign(room, updateData);

        // Đặt trạng thái thành 'đã nhận'
        room.status = 'đã nhận';

        // Lưu phòng đã cập nhật
        await room.save();

        res.send(room);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const getAllRooms = async (req, res) => {
    try {
        // Fetch all rooms from the database
        const rooms = await Room.find();
        
        // Send the list of rooms in the response
        res.status(200).json(rooms);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching rooms:', error);
        
        // Send an error response
        res.status(500).json({ message: 'Failed to fetch rooms', error });
    }
};

// const getRooms = async (req, res) => {
//     try {
//         // Fetch all rooms
//         const rooms = await Room.find();
//         // Fetch bookings related to each room
//         const roomData = await Promise.all(rooms.map(async (room) => {
//             const bookings = await Booking.find({ room: room._id }).populate('customer');
//             return {
//                 ...room.toObject(),
//                 bookings: bookings.map(booking => ({
//                     checkin: booking.checkin,
//                     checkout: booking.checkout,
//                     amount: booking.amount,
//                     guests: booking.guests,
//                     customer: booking.customer ? {
//                         name: booking.customer.name,
//                         email: booking.customer.email,
//                         phone: booking.customer.phone
//                     } : null
//                 }))
//             };
//         }));

//         res.status(200).json(roomData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getRooms = async (req, res) => {
    try {
        // Fetch all rooms
        const rooms = await Room.find();
        
        // Fetch all bookings and populate customer information
        const bookings = await Booking.find({ paid: false }).populate('customer');

        // Tạo đối tượng để theo dõi các phòng đã được đặt và chi tiết booking
        const roomData = rooms.map(room => {
            // Tìm booking liên quan đến phòng này
            const relatedBookings = bookings.filter(booking => 
                booking.rooms.some(bookedRoom => bookedRoom.roomId.toString() === room._id.toString())
            );

            // Thêm thông tin người đặt và số ngày
            const bookingDetails = relatedBookings.map(booking => {
                const roomBooking = booking.rooms.find(bookedRoom => bookedRoom.roomId.toString() === room._id.toString());
                
                // Tính số ngày ở lại
                const checkinDate = new Date(roomBooking.checkin);
                const checkoutDate = new Date(roomBooking.checkout);
                const daysBooked = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)); // Tính số ngày

                return {
                    customerName: booking.customer?.name || 'Unknown',
                    customerPhone: booking.customer?.phone || 'Unknown',
                    checkin: roomBooking.checkin,
                    checkout: roomBooking.checkout,
                    daysBooked: daysBooked
                };
            });

            return {
                ...room.toObject(),
                isBooked: bookingDetails.length > 0, // Xác định phòng đã được đặt hay chưa
                bookings: bookingDetails // Danh sách chi tiết booking liên quan đến phòng này
            };
        });

        res.status(200).json(roomData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the room by ID
        const result = await Room.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: 'Room deleted successfully' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room', error });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndDelete(id);
        if(!room) {
            return res.status(404).send({ message: "Room not found"});
        }
        res.send({ message: "Room deleted successfully"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const getRoomById = async (req, res) => {
    try {
        const roomId = req.params.id;
        // Fetch the room by its ID
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        // Fetch all unpaid bookings and populate customer information
        const bookings = await Booking.find({ paid: false }).populate('customer');

        // Tìm booking liên quan đến phòng này
        const relatedBookings = bookings.filter(booking => 
            booking.rooms.some(bookedRoom => bookedRoom.roomId.toString() === room._id.toString())
        );

        // Thêm thông tin người đặt và số ngày
        const bookingDetails = relatedBookings.map(booking => {
            const roomBooking = booking.rooms.find(bookedRoom => bookedRoom.roomId.toString() === room._id.toString());

            // Tính số ngày ở lại
            const checkinDate = new Date(roomBooking.checkin);
            const checkoutDate = new Date(roomBooking.checkout);
            const daysBooked = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)); // Tính số ngày

            return {
                bookingId: booking._id, // Thêm booking ID vào đây
                customerName: booking.customer?.name || 'Unknown',
                customerPhone: booking.customer?.phone || 'Unknown',
                checkin: roomBooking.checkin,
                checkout: roomBooking.checkout,
                daysBooked: daysBooked
            };
        });

        // Tạo đối tượng phản hồi với thông tin phòng và chi tiết booking
        const roomData = {
            ...room.toObject(),
            isBooked: bookingDetails.length > 0, // Xác định phòng đã được đặt hay chưa
            bookings: bookingDetails, // Danh sách chi tiết booking liên quan đến phòng này
            customerId: relatedBookings.length > 0 ? relatedBookings[0].customer._id : null // Lấy customerId từ booking đầu tiên
        };

        res.status(200).json(roomData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const getRoomById = async (req, res) => {
//     try {
//         const roomId = req.params.id;

//         // Fetch the room by its ID
//         const room = await Room.findById(roomId);

//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         // Fetch bookings for the room
//         const bookings = await Booking.find({ room: roomId }).populate('customer');

//         // Send room and booking information
//         res.status(200).json({
//             room,
//             bookings: bookings.map(booking => ({
//                 _id: booking._id,
//                 checkin: booking.checkin,
//                 checkout: booking.checkout,
//                 amount: booking.amount,
//                 guests: booking.guests,
//                 customer: booking.customer ? {
//                     name: booking.customer.name,
//                     email: booking.customer.email,
//                     phone: booking.customer.phone
//                 } : null
//             }))
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




module.exports = {
   addRoom,
   updateRoom,
   getRooms,
   deleteRoom,
   getRoomById,
   getAllRooms,
   createRoom,
   updateRooms,
   deleteRoomById,
//    getoneRoom,
};