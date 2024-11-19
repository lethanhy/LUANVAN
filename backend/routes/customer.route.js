const express = require('express');
// const Customer = require("../models/customer.model.js");
const router = express.Router();
const auth = require('../middleware/auth.js');
// const bcrypt = require("bcrypt");
const customerController = require('../controllers/customer.controller.js');

const multer = require('multer');
// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Nơi lưu trữ hình ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
    }
});

const upload = multer({ storage: storage });



router.post('/', customerController.createCustomer);
router.post('/changePassword', customerController.changePassword);

router.get('/', customerController.getAllCustomer);
router.get('/:id', customerController.getCustomerById);

router.delete('/:id', customerController.deleteCustomerById);

router.put('/:id', customerController.updateCustomer);

router.put('/:customerId/upload-image', upload.single('image'),customerController.uploadProfileImage);
// Đăng ký
router.post('/register', customerController.register);

// Đăng nhập
router.post('/login', customerController.login);

router.post('/refresh', customerController.refreshToken);
router.post('/logout', customerController.logout);

router.get('/me', auth, (req, res) => {
    res.json({ message: 'This is a protected route', customer: req.customer });
})

module.exports = router;