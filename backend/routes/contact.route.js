const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// GET route for adding a menu
router.post('/', contactController.createContact);
router.get('/', contactController.getAllContact);
router.delete('/:id', contactController.deleteById)


module.exports = router;
