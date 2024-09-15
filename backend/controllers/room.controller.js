const Room = require("../models/room.model.js");
const Booking = require("../models/booking.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');


const addRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).send(room);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndUpdate(id, req.body, {new: true});

        if( !room ) {
            return res.status(404).send({message: "Room not found"});
        }
        res.send(room);
    } catch (error) {
        res.status(404).send({message: error.message});
    }
};

// const getRooms = async (req, res) => {
//     try {
//         const rooms = await Room.find();
//         res.send(rooms);
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

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



// const getoneRoom = async (req, res) => {

//     try {
//         const { id } = req.params;
//         const rooms = await Room.findById(id);
//         res.status(200).json(rooms);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

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

        // Fetch bookings for the room
        const bookings = await Booking.find({ room: roomId }).populate('customer');

        // Send room and booking information
        res.status(200).json({
            room,
            bookings: bookings.map(booking => ({
                _id: booking._id,
                checkin: booking.checkin,
                checkout: booking.checkout,
                amount: booking.amount,
                guests: booking.guests,
                customer: booking.customer ? {
                    name: booking.customer.name,
                    email: booking.customer.email,
                    phone: booking.customer.phone
                } : null
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
   addRoom,
   updateRoom,
   getRooms,
   deleteRoom,
   getRoomById,
//    getoneRoom,
};