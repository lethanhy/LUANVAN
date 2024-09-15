const Booking = require("../models/booking.model.js");
const Room = require("../models/room.model.js");
const Customer = require("../models/customer.model.js");
const Cart = require("../models/cart.model.js");


// const createBooking = async (req, res) => {
//     try {
//         const { customerName,cccd, gioitinh, email, phone, address, checkin, checkout, amount, guests, adults, children, roomId } = req.body;

//         // Kiểm tra khách hàng đã tồn tại dựa vào email hoặc số điện thoại
//         let customer = await Customer.findOne({ email });
//         if(!customer) {
//             // Nếu khách hàng chưa tồn tại, tạo khách hàng mới
//             customer = new Customer({
//                 name: customerName,
//                 email,
//                 phone,
//                 address,
//                 cccd,
//                 gioitinh,
//             });
//             await customer.save();
//         }
//         // console.log(customer);

//         // Tạo booking mới 
//         const booking = new Booking({
//             checkin,
//             checkout,
//             amount,
//             guests,
//             adults,
//             children,
//             customer: customer._id,
//             room: roomId, // Liên kết đặt phòng với phòng
//         });
//         // console.log(booking);



//         //Lưu thông tin đặt phòng
//         await booking.save();

//         // // Thêm booking vào lịch sử của khách hàng
//         // customer.bookings.push(booking._id);
//         // await customer.save();

//         // Cập nhật trạng thái phòng
//         const room = await Room.findById(roomId);
//         room.status = 'đã đặt'; // Đánh dấu phòng là đã được đặt
//         // room.bookingInfo = {
//         //     customerName: customer.name,
//         //     checkInDate: checkin,
//         //     checkOutDate: checkout,
//         //     guests: guests
//         // };
//         await room.save();

//         res.status(201).json({ message: 'Booking created successfully', booking });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };



const createBooking = async (req, res) => {
    try {
      const { customerName, cccd, gioitinh, phone, email, address, rooms } = req.body;
  
      if (!rooms || rooms.length === 0) {
        return res.status(400).json({ message: 'No rooms selected' });
      }
  
      let customer = await Customer.findOne({ phone });
      if (!customer) {
        customer = new Customer({
          name: customerName,
          cccd,
          gioitinh,
          phone,
          address,
          email
        });
        await customer.save();
      }
  
      const bookedRooms = rooms.map(room => ({
        roomId: room.roomId, 
        checkin: new Date(room.checkin), 
        checkout: new Date(room.checkout)
      }));
  
      const newBooking = new Booking({
        customer: customer._id,
        rooms: bookedRooms,
        paid: false
      });
  
      await newBooking.save();

      // Clear all carts
      await Cart.deleteMany({});
  
      res.status(201).json(newBooking);
  
    } catch (error) {
      console.error('Error creating booking:', error.message || error);
      res.status(500).json({ message: 'Failed to create booking', error: error.message || error });
    }
  };
  


const getBookingId = async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Tìm booking và populate thông tin phòng
        const booking = await Booking.findById(bookingId).populate('room');

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



// const addCart = async (req, res) => {
//     try {
//         const { rooms } = req.body; // rooms is now expected to be an array

//         if (!Array.isArray(rooms) || rooms.length === 0) {
//             return res.status(400).json({ message: 'Rooms must be an array with at least one room ID' });
//         }

//         // Cập nhật trạng thái phòng
//         for (const roomData of rooms) {
//             const room = await Room.findById(roomData.roomId);

//             if (!room) {
//                 return res.status(404).json({ message: `Room with ID ${roomData.roomId} not found` });
//             }

//             room.status = 'đã đặt'; // Đánh dấu phòng là đã được đặt
//             await room.save();
//         }
        
//         cart.rooms.push(...rooms);

//         await cart.save();
//         res.status(201).json(cart);
//     } catch (error) {
//         console.error('Error adding cart:', error.message); // Log the error
//         res.status(400).json({ message: error.message });
//     }
// };





// const getCart = async (req, res) => {
//     try {
//         // Lấy thông tin giỏ hàng
//         const carts = await Cart.find().populate('rooms.roomId'); // Giả sử bạn có trường `rooms` chứa các ID phòng
        
//         // Nếu bạn cần thêm thông tin về phòng, bạn có thể tìm và ghép thông tin phòng vào giỏ hàng
//         for (const cart of carts) {
//             // Tìm thông tin phòng tương ứng với ID phòng trong giỏ hàng
//             cart.rooms.roomId = await Room.find({ _id: { $in: cart.rooms.roomId } });
//         }
        
//         res.status(200).json(carts);
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

const getCart = async (req, res) => {
  try {
    // Fetch cart and populate room details
    const carts = await Cart.find().populate('rooms.roomId', 'roomNumber type price description');

    res.status(200).json(carts);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
};

  
  

// const deleteCart = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const cart = await Cart.findByIdAndDelete(id);

//         // Cập nhật trạng thái phòng
//         const room = await Room.findById(cart.room);
//         if (room) {
//             room.status = 'trống'; // Đánh dấu phòng là có sẵn
//             await room.save();
//         }
//         res.status(200).json({ message: 'Cart deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting cart', error });
//     }
// }

const deleteCart = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the cart by its ID and delete it
        const cart = await Cart.findByIdAndDelete(id);

        if (cart) {
            // Loop through all rooms in the cart and update their status
            for (const roomObj of cart.rooms) {
                const room = await Room.findById(roomObj.roomId);
                if (room) {
                    room.status = 'trống'; // Mark room as available
                    await room.save();
                }
            }

            res.status(200).json({ message: 'Cart and rooms updated successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }

    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ message: 'Error deleting cart', error });
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
    getCart,
    deleteCart,
   


};