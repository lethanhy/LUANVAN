const express = require('express');
const router = express.Router();
const cleanRoomController = require('../controllers/cleanRoom.controller');
const { route } = require('./staff.route');

// POST route for adding a cart
router.post('/', cleanRoomController.cleanRoom);
router.get('/', cleanRoomController.getCleanRoom);
router.put('/:cleanroomId', cleanRoomController.updateClean);

router.put('/:cleanroomId/complete', cleanRoomController.updateRoomStatus);
router.put('/:cleanroomId/status', cleanRoomController.updateCleanMobile);



module.exports = router;
