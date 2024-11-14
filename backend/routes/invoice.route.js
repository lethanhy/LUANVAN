const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { route } = require('./staff.route');

// POST route for adding a cart
router.post('/', invoiceController.create);
router.get('/', invoiceController.getAllInvoice)




module.exports = router;
