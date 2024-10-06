const Room = require("../models/room.model.js");
const Booking = require("../models/booking.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');



const createRoom = async (req, res) => {
    try {
        const { roomNumber, type, price, status, trangthai, maxGuests, } = req.body;
        const image = req.file.filename; // Giả sử bạn sử dụng multer để upload hình ảnh

        // Xác nhận dữ liệu đầu vào
        if (!roomNumber || !type || !price || !status || !trangthai || !maxGuests) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        // // Kiểm tra giá
        // if (isNaN(price) || price <= 0) {
        //     return res.status(400).json({ message: 'Giá phải là một số dương' });
        // }

        const newRoom = new Room({
            roomNumber,
            type,
            price,
            status,
            trangthai,
            maxGuests,
            image,  // Lưu URL ảnh
           
            
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

// const getRooms = async (req, res) => {
//     try {
//         // Fetch all rooms
//         const rooms = await Room.find();
        
//         // Fetch all unpaid bookings and populate customer and room details
//         const bookings = await Booking.find({ paid: false })
//             .populate('customer')  // Populate customer details
//             .populate('room');     // Populate room details

//         // Create an array to track rooms along with their booking details
//         const roomData = rooms.map(room => {
//             // Find all bookings related to the current room
//             const relatedBookings = bookings.filter(booking => 
//                 booking.room._id.toString() === room._id.toString()  // Compare room IDs
//             );

//             // Add customer and booking details, including the number of days booked
//             const bookingDetails = relatedBookings.map(booking => {
//                 const checkinDate = new Date(booking.checkin);
//                 const checkoutDate = new Date(booking.checkout);
//                 const daysBooked = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)); // Calculate number of days

//                 return {
//                     customerName: booking.customer?.name || 'Unknown',
//                     customerPhone: booking.customer?.phone || 'Unknown',
//                     checkin: booking.checkin,
//                     checkout: booking.checkout,
//                     daysBooked: daysBooked,
//                     status: booking.status || 'Unknown' // Status of the booking
//                 };
//             });

//             return {
//                 ...room.toObject(),
//                 isBooked: bookingDetails.length > 0, // Determine if the room is booked
//                 bookings: bookingDetails // List of booking details related to this room
//             };
//         });

//         res.status(200).json(roomData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getRooms = async (req, res) => {
    try {
        const selectedDate = new Date(req.query.date);
        selectedDate.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

        // console.log("Selected Date:", selectedDate); // Kiểm tra ngày được chọn

        const rooms = await Room.find(); // Lấy tất cả các phòng

        // Lấy tất cả bookings để kiểm tra
        const bookings = await Booking.find({paid: false}).populate('customer'); // Giả định bạn có một mô hình Booking

        const filteredRooms = rooms.map((room) => {
            // Tìm các booking liên quan đến phòng này
            const roomBookings = bookings.filter((booking) => booking.room.toString() === room._id.toString());

            // Kiểm tra booking cho ngày đã chọn
            const bookingForDate = roomBookings.find((booking) => {
                const checkin = new Date(booking.checkin);
                const checkout = new Date(booking.checkout);
                checkin.setHours(0, 0, 0, 0);
                checkout.setHours(0, 0, 0, 0);

                // Sửa điều kiện để bao gồm cả ngày checkout
                return selectedDate >= checkin && selectedDate <= checkout; // Bao gồm ngày checkout
            });

            // console.log(`Room ID: ${room._id}, Booking Found: ${!!bookingForDate}`);

            if (bookingForDate) {
                return {
                    ...room.toObject(),
                    // status: "đã đặt",
                    booking: bookingForDate
                };
            } else {
                return {
                    ...room.toObject(),
                    status: "trống",
                    booking: []
                };
            }
        });

        res.status(200).json(filteredRooms);
    } catch (error) {
        console.error("Error fetching room list:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách phòng", error: error.message || error });
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

        // Fetch all unpaid bookings for this room and populate customer details
        const bookings = await Booking.find({ room: roomId, paid: false })
            .populate('customer')
            .populate('room');
            

        // Map booking details for the current room
        const bookingDetails = bookings.map(booking => {
            const checkinDate = new Date(booking.checkin);
            const checkoutDate = new Date(booking.checkout);
            const daysBooked = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)); // Calculate number of days

            return {
                bookingId: booking._id,
                customerName: booking.customer?.name || 'Unknown',
                customerPhone: booking.customer?.phone || 'Unknown',
                checkin: booking.checkin,
                checkout: booking.checkout,
                daysBooked: daysBooked,
                status: booking.status || 'Unknown', // Status of the booking
                orders: booking.orders.map(order => ({
                    orderId: order._id,
                    itemName: order.itemName,
                    quantity: order.quantity,
                    price: order.price,
                    totalPrice: order.quantity * order.price // Calculate total price for the order
                }))
               
            };
        });

        // Construct the room data along with its bookings
        const roomData = {
            ...room.toObject(),
            isBooked: bookingDetails.length > 0, // Check if the room is booked
            bookings: bookingDetails // List of booking details related to this room
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