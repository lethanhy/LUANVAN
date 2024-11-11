const express = require('express');
const router = express.Router();
const cleanRoomController = require('../controllers/cleanRoom.controller');

// POST route for adding a cart
router.post('/', cleanRoomController.cleanRoom);
router.get('/', cleanRoomController.getCleanRoom);
router.put('/:cleanroomId/complete', cleanRoomController.updateRoomStatus);

module.exports = router;
