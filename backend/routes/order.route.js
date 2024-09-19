const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


router.post('/', orderController.createOrder);
router.get('/:roomId', orderController.getOrder);

module.exports = router;
