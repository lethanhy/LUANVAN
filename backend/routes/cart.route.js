const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// POST route for adding a cart
router.post('/', cartController.addCart);

module.exports = router;
