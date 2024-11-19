const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { route } = require('./staff.route');

// POST route for adding a cart
router.post('/', invoiceController.create);
router.get('/', invoiceController.getAllInvoice);
router.get('/total-revenue',invoiceController.calculateTotalRevenue),
router.get('/monthly-revenue',invoiceController.calculateMonthlyRevenue),
router.get('/daily-revenue',invoiceController.calculateDailyRevenue),
router.delete('/:id', invoiceController.deleteInvoiceById)





module.exports = router;
