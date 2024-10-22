const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// GET route for adding a menu
router.get('/', reviewController.getAllReview);
router.get('/:customerId', reviewController.getReviewById);
router.post('/', reviewController.createReview);
// router.put('/:id', menuController.updateMenu);
// router.delete('/:id', menuController.deleteMenuById);

module.exports = router;
