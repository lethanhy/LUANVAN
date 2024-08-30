const express = require('express');
const connectDB = require('./utils/db.js');
const bookingRoutes = require('./routes/booking.route.js');
const customerRoutes = require('./routes/customer.route.js');
const roomRoutes = require('./routes/room.route.js');
const staffRoutes = require('./routes/staff.route.js');
const cors = require('cors');
const app = express();


// Cấu hình CORS
app.use(cors());
// kết nối cơ sở dữ liệu
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// routes
app.use("/bookings", bookingRoutes);
app.use("/customers", customerRoutes);
app.use("/rooms", roomRoutes);
app.use("/staff", staffRoutes);

// // Backend (Express.js)
// app.get('/api/customers', (req, res) => {
//     res.json({ message: 'Customers list' });
//   });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// app.get('/', (req, res) => {
//     res.send("Hello from Node API Server Update");
// });


// mongoose
//     .connect('mongodb://127.0.0.1:27017/hotel')
//   .then(() => {
//     console.log('Connected to database!');
//     app.listen(3000, () => {
//         console.log("Server is running on port 3000");
//     });
//   })
//   .catch(() => {
//     console.log("Connection failed!");
//   });
     