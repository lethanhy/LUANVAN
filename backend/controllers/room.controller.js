const Room = require("../models/room.model.js");
const Booking = require("../models/booking.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');



const createRoom = async (req, res) => {
    try {
        const { roomNumber, roomName, type, price, children, adults, trangthai,description } = req.body;
        const image = req.file.filename; // Giả sử bạn sử dụng multer để upload hình ảnh

        // Xác nhận dữ liệu đầu vào
        if (!roomNumber || !roomName ||!type || !price || !trangthai || !children ||!adults || !description) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        // // Kiểm tra giá
        // if (isNaN(price) || price <= 0) {
        //     return res.status(400).json({ message: 'Giá phải là một số dương' });
        // }

        const newRoom = new Room({
            roomNumber,
            roomName,
            type,
            price,
            children,
            adults,
            trangthai,
            description,
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

        // Check if there's an image in the request
        if (req.file) {
            // If you are using multer or any file upload middleware
            updateData.image = req.file.filename; // Assuming you're storing only the filename
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

        const rooms = await Room.find({ xoaRoom: true}); // Lấy tất cả các phòng

        // Lấy tất cả bookings để kiểm tra
        const bookings = await Booking.find({ status: { $nin: ['đã hủy', 'hoàn thành','chờ xác nhận'] } }).populate('customer'); // Giả định bạn có một mô hình Booking

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

        // Kiểm tra xem phòng có bản ghi đặt với trạng thái khác 'đã hủy' và 'hoàn thành' không
        const bookingExists = await Booking.findOne({ 
            room: id, 
            status: { $nin: ['đã hủy', 'hoàn thành'] } 
        });

        if (bookingExists) {
            return res.status(400).json({ message: 'Phòng đang có người đặt, không thể xóa' });
        }

        // Nếu không có bản ghi đặt nào, tiến hành cập nhật phòng
        const result = await Room.findByIdAndUpdate(
            id,
            { xoaRoom: false },  // Cập nhật trường xoaRoom thành false
            { new: true }  // Trả về document mới đã được cập nhật
        );

        if (result) {
            res.status(200).json({ message: 'Cập nhật phòng thành công', room: result });
        } else {
            res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật phòng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật phòng', error });
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


const getRoomByUserId = async (req, res) => {
    try {
        const roomId = req.params.id;

        // Fetch the room by its ID
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(201).send(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const getRoomByIdAndDate = async (req, res) => {
//     try {
//         const { id } = req.params; // Room ID from route parameters
//         const selectedDate = new Date(req.query.date + 'T00:00:00Z'); // Date from query parameters
//         // selectedDate.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

//         // console.log('Raw Date Input:', req.query.date); // Log để kiểm tra giá trị
//         // console.log('Selected Date:', selectedDate); // Log để kiểm tra giá trị đã chuyển đổi

//         // 1. Fetch the room by ID
//         const room = await Room.findById(id);
//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         // 2. Find an unpaid booking for the given room ID and date range
//         const bookingForDate = await Booking.findOne({
//             room: id,
//             // paid: false,
//             status: { $nin: ['đã hủy', 'hoàn thành', 'chờ xác nhận'] },
//             checkin: { $lte: selectedDate }, // Selected date must be on or after check-in
//             checkout: { $gte: selectedDate }  // Selected date must be on or before check-out
//         })
//         .populate('customer')
//         .populate('orders');

//         // 3. Prepare booking details if a booking is found
//         const bookingDetails = bookingForDate
//             ? {
//                 bookingId: bookingForDate._id,
//                 customerName: bookingForDate.customer?.name || 'Unknown',
//                 customerPhone: bookingForDate.customer?.phone || 'Unknown',
//                 checkin: bookingForDate.checkin,
//                 checkout: bookingForDate.checkout,
//                 checkinTime: bookingForDate.checkinTime,
//                 daysBooked: Math.ceil(
//                     (new Date(bookingForDate.checkout) - new Date(bookingForDate.checkin)) / (1000 * 60 * 60 * 24)
//                 ),
//                 status: bookingForDate.status,
//                 orders: bookingForDate.orders.map(order => ({
//                     orderId: order._id,
//                     itemName: order.itemName,
//                     quantity: order.quantity,
//                     price: order.price,
//                     totalPrice: order.quantity * order.price
//                 })),
//             }
//             : null;

//             // console.log('Selected Date:', selectedDate);
//         // console.log('Room ID:', id);
//         // console.log('Bookings Found:', bookingForDate);

//         // 4. Construct the final room data with booking info
//         const roomData = {
//             ...room.toObject(),
//             // status: bookingDetails ? 'đã đặt' : 'trống', // Booked or available
//             booking: bookingDetails || {}
//         };

//         // 5. Return the room and booking data
//         res.status(200).json(roomData);
//     } catch (error) {
//         console.error('Error fetching room or booking:', error);
//         res.status(500).json({ message: 'Lỗi khi lấy phòng hoặc booking', error: error.message || error });
//     }
// };
const getRoomByIdAndDate = async (req, res) => {
    try {
        const { id } = req.params;
        const rawDate = req.query.date;

        if (!rawDate) {
            return res.status(400).json({ message: 'Ngày không hợp lệ' });
        }

        const selectedDate = new Date(rawDate);
        selectedDate.setUTCHours(0, 0, 0, 0);
        console.log('Selected Date:', selectedDate);

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
        }

        const bookingForDate = await Booking.findOne({
            room: id,
            status: { $nin: ['đã hủy', 'hoàn thành', 'chờ xác nhận'] },
            checkin: { $lte: new Date(selectedDate.setUTCHours(23, 59, 59, 999)) },
            checkout: { $gte: new Date(selectedDate.setUTCHours(0, 0, 0, 0)) },
        })
            .populate('customer')
            .populate('orders');

        console.log('Booking Found:', bookingForDate);

        const bookingDetails = bookingForDate
            ? {
                  bookingId: bookingForDate._id,
                  customerName: bookingForDate.customer?.name || 'Không rõ',
                  customerPhone: bookingForDate.customer?.phone || 'Không rõ',
                  checkin: bookingForDate.checkin,
                  checkout: bookingForDate.checkout,
                  checkinTime: bookingForDate.checkinTime,
                  chechoutTime: bookingForDate.chechoutTime,
                  status: bookingForDate.status,
                  orders: bookingForDate.orders.map(order => ({
                      orderId: order._id,
                      itemName: order.itemName,
                      quantity: order.quantity,
                      price: order.price,
                      totalPrice: order.quantity * order.price,
                  })),
              }
            : null;

        const roomData = {
            ...room.toObject(),
            booking: bookingDetails || {},
        };

        res.status(200).json(roomData);
    } catch (error) {
        console.error('Error fetching room or booking:', error);
        res.status(500).json({ message: 'Lỗi khi lấy phòng hoặc booking', error: error.message });
    }
};



const getRoomUndeleted = async (req,res) => {
    try {
        const rooms = await Room.find({ trangthai: 'Chưa dọn dẹp'});
        res.status(200).json(rooms);
    } catch (error) {
         res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng.' });
    }
}





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
   getRoomByUserId,
   getRoomByIdAndDate,
   getRoomUndeleted
//    getoneRoom,
};