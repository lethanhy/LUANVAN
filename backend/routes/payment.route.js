const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.post('/vnpay/create_payment_url', PaymentController.createPaymentVnpayUrl);
router.get('/vnpay/return', PaymentController.vnpayReturn);
router.get('/vnpay/ipn', PaymentController.vnpayIpn);


module.exports = router;
