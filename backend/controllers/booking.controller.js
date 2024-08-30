const Booking = require("../models/booking.model.js");


exports.createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('customer');
        res.status(200).send(bookings);
    } catch (error) {
        res.status(500).send(error);
    }
};


// const getBookings = async (req, res) => {

//     try {
//         const bookings = await Booking.find({});
//         res.status(200).json(bookings);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

// const getBooking = async (req, res) => {

//     try {
//         const { id } = req.params;
//         const booking = await Booking.findById(id);
//         res.status(200).json(booking);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

// const createBooking = async (req, res) => {
//     try {
//         const booking = await Booking.create(req.body);
//         res.status(200).json(booking);

//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }

// const updateBooking = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const booking = await Booking.findByIdAndUpdate(id, req.body);

//         if(!booking) {
//             return res.status(404).json({message: "Booking not found"});
//         }

//         const updateBooking= await Booking.findById(id);
//         res.status(200).json(updateBooking);


//     } catch (error) {
//         res.status(500).json({message: error.message});
        
//     }
// };
// const deleteBooking = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const booking = await Booking.findByIdAndDelete(id);

//         if(!booking) {
//             return res.status(404).json({message: "Booking not found"});
//         }
//         res.status(200).json({message: "Booking deleted successfully"});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }

// module.exports = {
//     getBookings,
//     getBooking,
//     createBooking,
//     updateBooking,
//     deleteBooking,


// };