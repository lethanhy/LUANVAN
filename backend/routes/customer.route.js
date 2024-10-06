const express = require('express');
// const Customer = require("../models/customer.model.js");
const router = express.Router();
const auth = require('../middleware/auth.js');
// const bcrypt = require("bcrypt");
const customerController = require('../controllers/customer.controller.js');


router.post('/', customerController.createCustomer);

router.get('/', customerController.getAllCustomer);
router.get('/:id', customerController.getCustomerById);

router.delete('/:id', customerController.deleteCustomerById);

router.put('/:id', customerController.updateCustomer);
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