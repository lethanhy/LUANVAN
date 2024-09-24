const Booking = require("../models/booking.model.js");
const Room = require("../models/room.model.js");
const Customer = require("../models/customer.model.js");
const Cart = require("../models/cart.model.js");
const MenuItem = require("../models/menu.model.js");

const getBooking = async (req, res) => {
    try {
        // Tìm booking và populate thông tin phòng
        const booking = await Booking.find().populate('customer');

        if(!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



const createBooking = async (req, res) => {
    const { customerName, cccd, gioitinh, email, phone, address, rooms } = req.body;
  
    if (!rooms || rooms.length === 0) {
        return res.status(400).json({ message: 'No rooms selected' });
    }
  
    try {
        // Find or create a new customer based on phone number
        let customer = await Customer.findOne({ phone });
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
  
        // Create bookings and update room statuses
        const bookingPromises = rooms.map(async (room) => {
            // Create new booking for each room
            const newBooking = new Booking({
                customer: customer._id,
                room: room.id, // Assuming room.id is ObjectId
                paid: false,
                checkin: room.checkin,
                checkout: room.checkout,
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

  

  


const getBookingId = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Tìm booking và populate thông tin phòng
        const booking = await Booking.findById(bookingId).populate('room').populate('customer');

        if(!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Cập nhật booking
        const booking = await Booking.findByIdAndUpdate(id, updates, { new: true }).populate('room');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Kiểm tra xem booking có thuộc về người dùng hiện tại không
        if (booking.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(booking);
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

        // Kiểm tra xem booking có thuộc về người dùng hiện tại không
        if (booking.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Cập nhật trạng thái phòng
        const room = await Room.findById(booking.room);
        if (room) {
            room.available = true; // Đánh dấu phòng là có sẵn
            await room.save();
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error });
    }
};

const getRoomByAvailable = async (req, res) => {
    try {
        const rooms = await Room.find({ status:'trống' });
        res.send(rooms);
    } catch (error) {
        
    }
}




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
const getRoomDate =  async (req, res) => {
    const { date } = req.params; // Expecting date in YYYY-MM-DD format
  
    try {
      // Find all bookings for the given date
      const bookings = await Booking.find({
        $or: [
          { checkin: { $lte: date }, checkout: { $gte: date } }, // Includes the date within check-in and check-out range
        ],
      });
  
      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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


};