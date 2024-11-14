const Booking = require("../models/booking.model.js");
const Room = require("../models/room.model.js");
const Customer = require("../models/customer.model.js");
const Cart = require("../models/cart.model.js");
const MenuItem = require("../models/menu.model.js");
const Staff = require("../models/staff.model.js");

const getBooking = async (req, res) => {
    try {
        // Tìm booking và populate thông tin phòng
        const booking = await Booking.find().populate('customer').populate('room').populate('staff');

        if(!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



const createBooking = async (req, res) => {
    const { customerName,staff, cccd, gioitinh, email, phone, address, rooms} = req.body;
  
    if (!rooms || rooms.length === 0) {
        return res.status(400).json({ message: 'No rooms selected' });
    }
  
    try {
        // Find or create a new customer based on phone number
        let customer = await Customer.findOne({ phone, xoaCustomer: { $nin: [false]  }});
         // Nếu không tìm thấy khách hàng, tạo mới
        if (!customer) {
            customer = new Customer({
                name: customerName,
                cccd,
                gioitinh,
                phone,
                address,
                email,
            });
            await customer.save();
        }

          // Lấy ID của khách hàng vừa tìm thấy hoặc mới tạo
          const customerId = customer._id;

  
        // Create bookings and update room statuses
        const bookingPromises = rooms.map(async (room) => {
            // Create new booking for each room
            const newBooking = new Booking({
                staff: staff,
                customer: customerId,
                room: room.id, // Assuming room.id is ObjectId
                paid: false,
                checkin: room.checkin,
                checkout: room.checkout,
                bookingType:"tại chỗ",
                payment: {
                    phuongthuc:"Thanh toán tiền mặt",
                    paymentStatus:"thành công"
                },
            });
            await newBooking.save();
  
            // Update room status to "booked"
            const roomToUpdate = await Room.findById(room.id);
            if (!roomToUpdate) {
                throw new Error(`Room with id ${room.id} not found`);
            }
            roomToUpdate.status = 'đã đặt'; // Mark room as booked
            await roomToUpdate.save();

            return newBooking;
        });
  
        // Wait for all booking and room updates to complete
        const bookings = await Promise.all(bookingPromises);
  
        // Optionally clear the cart (if needed)
        // await Cart.deleteMany({});
  
        res.status(201).json(bookings);
    } catch (error) {
        console.error('Error creating bookings:', error.message || error);
        res.status(500).json({ message: 'Failed to create bookings', error: error.message || error });
    }
};

const createBookingUser = async (req, res) => {
    const { checkin, checkout, customer, room,payment} = req.body;
     // Validation
            if (!checkin || !checkout || !customer || !room) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newBooking = new Booking({
                checkin,
                checkout,
                paid: false,
                customer,
                room,
                status:"chờ xác nhận",
                payment
            });

            
            try {
                const savedBooking = await newBooking.save();
                return res.status(201).json({ bookingId: savedBooking._id });
            } catch (error) {
                console.error('Error creating booking:', error);
                return res.status(500).json({ message: 'Server error' });
            }
}

  

  


const getBookingId = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Tìm booking và populate thông tin phòng
        const booking = await Booking.findById(bookingId).populate('room').populate('customer').populate('staff');

        if(!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getBookingUserId = async (req, res) => {
    try {
        const customerId = req.params.id; // Lấy customer ID từ tham số route
    
        // Tìm tất cả các booking có customer là customerId
        const bookings = await Booking.find({ customer: customerId })
          .populate('room') // Populated thông tin phòng
          .populate('customer') // Populated thông tin khách hàng
          .populate('staff'); // Nếu bạn cần thông tin về nhân viên (staff)
    
        if (bookings.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy booking nào cho khách hàng này.' });
        }
    
        res.status(200).json(bookings); // Trả về danh sách booking
      } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
      }
};
const checkoutAndPay = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Tìm đơn đặt phòng bằng bookingId
        const booking = await Booking.findById(bookingId).populate('room');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Xác nhận thanh toán và cập nhật trạng thái đặt phòng
        booking.paid = true;
        booking.status = "completed";  // Cập nhật trạng thái đặt phòng thành hoàn thành
        await booking.save();

        // cập nhật trạng thái phòng thành có sẵn
        const room = await Room.findById(booking.room._id);
        room.available = true;
        await room.save();

        return res.status(200).json({
            message: 'Checkout and payment successful. Room is now available.',
            booking,
            room
        });


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

const getBookingHistory = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Tìm tất cả các đơn đặt phòng đã hoàn thành của khách hàng
        const bookingHistory = await Booking.find({
            customer: customerId,
            status: "completed"  // Lọc theo trạng thái đã hoàn thành
        }).populate('room');

        if (!bookingHistory.length) {
            return res.status(404).json({ message: 'No booking history found for this customer' });
        }

        return res.status(200).json(bookingHistory);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// const updateBooking = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         // Cập nhật booking
//         const booking = await Booking.findByIdAndUpdate(id, updates, { new: true }).populate('room');

//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         // Kiểm tra xem booking có thuộc về người dùng hiện tại không
//         if (booking.customer.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: 'Access denied' });
//         }

//         res.status(200).json(booking);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating booking', error });
//     }
// };


const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm kiếm booking theo ID
        const booking = await Booking.findById(id);

        // Kiểm tra xem booking có tồn tại không
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Kiểm tra xem booking có thuộc về người dùng hiện tại không (nếu cần)
        // if (booking.customer.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Access denied' });
        // }

        // Cập nhật trạng thái 'paid' thành true cho booking
        booking.paid = true;
        booking.status = 'hoàn thành';

        // Tìm phòng liên quan đến booking và cập nhật trạng thái phòng
        const room = await Room.findById(booking.room);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.trangthai = "Chưa dọn dẹp"; // Cập nhật trạng thái phòng
        await room.save(); // Lưu lại phòng sau khi cập nhật trạng thái

        // Lưu lại booking đã cập nhật
        const updatedBooking = await booking.save();

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error });
    }
};


const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa booking
        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // // Kiểm tra xem booking có thuộc về người dùng hiện tại không
        // if (booking.customer.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Access denied' });
        // }

        // // Cập nhật trạng thái phòng
        // const room = await Room.findById(booking.room);
        // if (room) {
        //     room.available = true; // Đánh dấu phòng là có sẵn
        //     await room.save();
        // }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error });
    }
};

// const getRoomByAvailable = async (req, res) => {
//     try {
//         const rooms = await Room.find({ status:'trống' });
//         res.send(rooms);
//     } catch (error) {
        
//     }
// }

const getRoomByAvailable = async (req, res) => {
    const { checkin, checkout } = req.query; // Expect query parameters for checkin and checkout dates

    try {
        // Step 1: Find all bookings that overlap with the requested date range
        const overlappingBookings = await Booking.find({
            $and: [
                {
                $or: [
                    { checkin: { $lt: checkout }, checkout: { $gt: checkin } }, // Overlaps with the requested period
                    { checkin: { $eq: checkout } }, // Không cho đặt phòng vào ngày checkout
                    { checkout: { $eq: checkin } }  // Không cho đặt phòng vào ngày checki
                ],
                },
        { status: { $nin: ["đã hủy","hoàn thành"]}}
    ]
           
            
        }).select('room'); // Only select the room field

        // Step 2: Extract the IDs of rooms that are booked
        const bookedRoomIds = overlappingBookings.map(bookings => bookings.room);

        // Step 3: Find rooms that are NOT in the bookedRoomIds array
        const availableRooms = await Room.find({
            _id: { $nin: bookedRoomIds },
            // maxGuests: adults,
            // children:children, // Exclude rooms that are booked
            trangthai: 'Đã dọn dẹp', // Ensure the room is marked as available
            xoaRoom: true,
        });

        // Step 4: Return available rooms
        res.status(200).json(availableRooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ message: 'Error fetching available rooms' });
    }
};

const getRoomByUserOnline = async (req, res) => {
    const { checkin, checkout, adults, children } = req.query; // Thêm adults và children vào tham số truy vấn

    try {
        // Step 1: Tìm các booking trùng lặp với khoảng thời gian yêu cầu
        const overlappingBookings = await Booking.find({
            $and: [
                {
                    $or: [
                        { checkin: { $lt: checkout }, checkout: { $gt: checkin } }, // Trùng với khoảng thời gian
                        { checkin: { $eq: checkout } }, // Không cho đặt phòng vào ngày checkout
                        { checkout: { $eq: checkin } }  // Không cho đặt phòng vào ngày checkin
                    ],
                },
                { status: { $nin: ["đã hủy", "hoàn thành"] } } // Loại trừ trạng thái đã hủy hoặc hoàn thành
            ]
        }).select('room'); // Chỉ chọn trường room

        // Step 2: Trích xuất ID các phòng đã đặt
        const bookedRoomIds = overlappingBookings.map(bookings => bookings.room);

        // Step 3: Tìm các phòng trống có điều kiện về sức chứa
        const query = {
            _id: { $nin: bookedRoomIds }, // Loại trừ các phòng đã đặt
            trangthai: 'Đã dọn dẹp', // Phòng có trạng thái 'Đã dọn dẹp'
            xoaRoom: true // Phòng chưa bị xóa
        };

        // Add adults and children condition if they are provided
        if (adults) {
            query.adults = { $gte: adults }; // Số người lớn tối thiểu
        }

        if (children) {
            query.children = { $gte: children }; // Số trẻ em tối thiểu
        }

        const availableRooms = await Room.find(query);

        // Step 4: Trả về danh sách các phòng trống
        res.status(200).json(availableRooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ message: 'Error fetching available rooms' });
    }
};






const addCart = async (req, res) => {
    try {
        const { checkin, checkout, roomId } = req.body;

        if (!checkin || !checkout || !roomId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Cập nhật trạng thái phòng
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.status = 'đã đặt'; // Đánh dấu phòng là đã được đặt
        await room.save();

        // Tìm giỏ hàng mặc định hoặc tạo mới nếu không tồn tại
        let cart = await Cart.findOne(); // Assumes you have only one default cart
        if (!cart) {
            cart = new Cart({ 
                // checkin: new Date(), 
                // checkout: new Date(), 
                rooms: [] 
            });
        }

        // Thêm phòng vào giỏ hàng
        cart.rooms.push({
            roomId,
            checkin,
            checkout
        });
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error while adding to cart:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};





  
  



const deleteCart = async (req, res) => {
    try {
        const { roomId } = req.params; // Lấy ID phòng từ tham số URL

        // Tìm giỏ hàng chứa phòng với ID đã cho
        const cart = await Cart.findOne({ 'rooms.roomId': roomId });

        if (cart) {
            // Lọc phòng cần xóa ra khỏi danh sách phòng trong giỏ hàng
            const updatedRooms = cart.rooms.filter(roomObj => roomObj.roomId.toString() !== roomId);

            // Cập nhật trạng thái của các phòng đã xóa
            for (const roomObj of cart.rooms) {
                if (roomObj.roomId.toString() === roomId) {
                    const room = await Room.findById(roomObj.roomId);
                    if (room) {
                        room.status = 'trống'; // Đánh dấu phòng là trống
                        await room.save();
                    }
                }
            }

            // Cập nhật giỏ hàng với danh sách phòng đã được cập nhật
            cart.rooms = updatedRooms;
            await cart.save();

            res.status(200).json({ message: 'Phòng đã được xóa khỏi giỏ hàng và trạng thái phòng đã được cập nhật thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy giỏ hàng chứa phòng với ID đã cho' });
        }

    } catch (error) {
        console.error('Lỗi khi xóa phòng khỏi giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi khi xóa phòng khỏi giỏ hàng', error });
    }
};

// Endpoint to get bookings by date
const getRoomDate = async (req, res) => {
    const { date } = req.params; // Expecting date in YYYY-MM-DD format

    // Validate date format (basic check)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    try {
        // Find all bookings for the given date where paid is false
        const bookings = await Booking.find({
            $or: [
                { checkin: { $lte: date }, checkout: { $gte: date } }, // Includes the date within check-in and check-out range
            ],
            // paid: false, // Ensure that only unpaid bookings are included
            status: { $nin: ['đã hủy', 'hoàn thành'] }

        })
        .populate('customer')
        .populate('room');

        // Check if any bookings were found
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the selected date.' });
        }

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the customer by ID
        const result = await Booking.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Error deleting customer', error });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Tìm phòng theo ID
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).send({ message: "Không tìm thấy phòng" });
        }

        // Cập nhật các trường khác trong phòng
        Object.assign(booking, updateData);

        // Kiểm tra nếu `checkinTime` có trong `updateData` và cập nhật
        if (updateData.checkinTime) {
            booking.checkinTime = updateData.checkinTime;
        }

        // Đặt trạng thái thành 'đã nhận'
        booking.status = 'đã nhận';

        // Lưu phòng đã cập nhật
        await booking.save();

        res.send(booking);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateDeleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Tìm phòng theo ID
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).send({ message: "Không tìm thấy phòng" });
        }

        // Cập nhật các trường khác trong phòng
        Object.assign(booking, updateData);

        // Đặt trạng thái thành 'đã nhận'
        booking.status = 'đã hủy';

        // Lưu phòng đã cập nhật
        await booking.save();

        res.send(booking);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const confirmation = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Tìm phòng theo ID
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).send({ message: "Không tìm thấy phòng" });
        }

        // Cập nhật các trường khác trong phòng
        Object.assign(booking, updateData);

        // // Đặt trạng thái thành 'đã nhận'
        // booking.status = 'đã đặt';

        // Lưu phòng đã cập nhật
        await booking.save();

        res.send(booking);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const earlyCheckout = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkoutDate } = req.body;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).send({ message: 'Không tìm thấy đặt phòng' });
        }

        const checkoutTime = new Date(checkoutDate).getTime();
        const originalCheckoutTime = new Date(booking.checkout).getTime();
        const checkinTime = new Date(booking.checkin).getTime();

        // Kiểm tra nếu ngày trả phòng lớn hơn ngày checkout ban đầu
        if (checkoutTime > originalCheckoutTime) {
            return res.status(400).send({ message: 'Ngày trả phòng không thể sau ngày đặt ban đầu' });
        }

        // Kiểm tra nếu ngày trả phòng trùng với ngày check-in
        if (checkoutTime === checkinTime) {
            return res.status(400).json({ message: 'Ngày trả phòng không thể bằng ngày đặt phòng ban đầu' });
        }

        // Cập nhật ngày checkout và trạng thái
        booking.checkout = new Date(checkoutDate);
        booking.status = 'hoàn thành'; // Nếu cần cập nhật trạng thái

        booking.updatedAt = new Date(); // Cập nhật timestamp
        await booking.save();

        res.send({ message: 'Cập nhật trả phòng thành công!', booking });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getWeeklyBookings = async (req, res) => {
    try {
        // Lấy ngày hiện tại
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Lấy ngày đầu tuần (chủ nhật)
        startOfWeek.setHours(0, 0, 0, 0); // Đặt thời gian đầu ngày

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);// Lấy ngày cuối tuần (Thứ Bảy)
        endOfWeek.setHours(23, 59, 59, 99) // Đặt thời gian cuối ngày

            // Truy vấn các đơn đặt phòng có ngày check-in trong khoảng từ đầu tuần đến cuối tuần
            const bookings = await Booking.find({
                checkin: {
                $gte: startOfWeek, // Ngày check-in >= ngày đầu tuần
                $lte: endOfWeek,   // Ngày check-in <= ngày cuối tuần
                },
            });

            // Khởi tạo mảng chứa số lượng đặt phòng cho mỗi ngày trong tuần (Chủ Nhật đến Thứ Bảy)
            const weeklyData = Array(7).fill(0); // [0, 0, 0, 0, 0, 0, 0]

            // Duyệt qua danh sách các đơn đặt phòng và đếm số lượng đặt phòng cho từng ngày
            bookings.forEach(booking => {
                const day = new Date(booking.checkin).getDay(); // Lấy chỉ số ngày trong tuần (0 = CN, 1 = Thứ 2, ...)
                weeklyData[day] += 1; // Tăng số lượng đặt phòng cho ngày tương ứng
            });

             // Trả về dữ liệu thống kê theo tuần
            res.status(200).json({
                message: 'Weekly bookings retrieved successfully',
                data: weeklyData, // [Số đơn CN, Thứ 2, Thứ 3, ..., Thứ 7]
            });
        
    } catch (error) {
        console.error('Error fetching weekly bookings:', error);
        res.status(500).json({
          message: 'Error fetching weekly bookings',
          error: error.message,
        });
      }
}

const getDailyBookings = async (req, res) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Đặt thời gian đầu ngày

        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày

        const bookings = await Booking.find({
            checkin: {
                $gte: currentDate,
                $lte: endOfDay,
            },
        });

        // Khởi tạo mảng chứa số lượng đặt phòng cho mỗi giờ trong ngày (0h đến 23h)
        const dailyData = Array(24).fill(0);

        bookings.forEach(booking => {
            const hour = new Date(booking.createdAt).getHours(); // Lấy chỉ số giờ (0 đến 23)
            dailyData[hour] += 1; // Tăng số lượng đặt phòng cho giờ tương ứng
        });

        res.status(200).json({
            message: 'Daily bookings retrieved successfully',
            data: dailyData, // [Số đơn đặt 0h, 1h, ..., 23h]
        });
    } catch (error) {
        console.error('Error fetching daily bookings:', error);
        res.status(500).json({
            message: 'Error fetching daily bookings',
            error: error.message,
        });
    }
};

const getMonthlyBookings = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Ngày đầu tháng
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Ngày cuối tháng

        const bookings = await Booking.find({
            checkin: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        });

        // Khởi tạo mảng chứa số lượng đặt phòng cho mỗi ngày trong tháng
        const daysInMonth = endOfMonth.getDate();
        const monthlyData = Array(daysInMonth).fill(0);

        bookings.forEach(booking => {
            const day = new Date(booking.checkin).getDate() - 1; // Lấy chỉ số ngày trong tháng (0 = Ngày 1, ...)
            monthlyData[day] += 1; // Tăng số lượng đặt phòng cho ngày tương ứng
        });

        res.status(200).json({
            message: 'Monthly bookings retrieved successfully',
            data: monthlyData, // [Số đơn đặt ngày 1, 2, ..., ngày cuối]
        });
    } catch (error) {
        console.error('Error fetching monthly bookings:', error);
        res.status(500).json({
            message: 'Error fetching monthly bookings',
            error: error.message,
        });
    }
};










module.exports = {
    getBookingId,
    createBooking,
    checkoutAndPay,
    getBookingHistory,
    updateBooking,
    deleteBooking,
    getRoomByAvailable,
    addCart,
    deleteCart,
    getBooking,
    getRoomDate,
    deleteBookingById,
    updateRoom,
    createBookingUser,
    getBookingUserId,
    updateDeleteRoom,
    confirmation,
    earlyCheckout,
    getWeeklyBookings,
    getDailyBookings,
    getMonthlyBookings,
    getRoomByUserOnline


};