const express = require('express');
const connectDB = require('./utils/db.js');
const bookingRoutes = require('./routes/booking.route.js');
const customerRoutes = require('./routes/customer.route.js');
const roomRoutes = require('./routes/room.route.js');
const cartRoutes = require('./routes/cart.route.js');
const staffRoutes = require('./routes/staff.route.js');
const menuRoutes = require('./routes/menu.route.js');
const orderRoutes = require('./routes/order.route.js');
const reviewRoutes = require('./routes/review.route.js');
const cors = require('cors');
const multer = require('multer');
const app = express();
const path = require('path');


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
app.use("/cart", cartRoutes);
app.use("/staff", staffRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/review", reviewRoutes);

// Cấu hình thư mục chứa ảnh được phép truy cập công khai
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Cấu hình lưu file bằng Multer trong bộ nhớ tạm
// const storage = multer.memoryStorage(); // Multer sẽ lưu ảnh vào bộ nhớ tạm
// const upload = multer({ storage: storage });


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
     