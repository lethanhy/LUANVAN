const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// GET route for adding a menu
router.get('/', reviewController.getAllReview);
router.get('/:customerId', reviewController.getReviewByCustomer);
router.get('/admin/:id', reviewController.getReviewById);
router.post('/', reviewController.createReview);

router.post('/:id/reply', reviewController.feedbackCustomer);
// router.put('/:id', menuController.updateMenu);
router.delete('/:id', reviewController.deleteById);

module.exports = router;
