const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

// GET route for adding a menu
router.post('/', roleController.createRole);
router.get('/', roleController.getAllRole);
router.delete('/:id', roleController.deleteById)


module.exports = router;
