const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

// GET route for adding a menu
router.get('/', menuController.getMenu);
router.post('/', menuController.createMenu);
router.put('/:id', menuController.updateMenu);

module.exports = router;
