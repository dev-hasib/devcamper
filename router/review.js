const express = require('express');
const {
	getAllReviews,
	getSingleReviews,
	updateReviews,
	deleteReviews,
} = require('../controllers/review');
const ReviewModel = require('../models/Review');
const advancedResult = require('../middleware/advancedResult');
const { protect, authorized } = require('../middleware/auth');

const router = express.Router();
//this rout is get all reviews for bootcamp
router.route('/:bootcampId/reviews').get(
	advancedResult(ReviewModel, {
		path: 'bootcamp',
		select: 'name description',
	}),
	getAllReviews
);

//this rout is get all reviews for a bootcamp
router.route('/').get(
	advancedResult(ReviewModel, {
		path: 'bootcamp',
		select: 'name description',
	}),
	getAllReviews
);

router
	.route('/:id')
	.get(getSingleReviews)
	.put(protect, authorized('user', 'admin'), updateReviews)
	.delete(protect, authorized('user', 'admin'), deleteReviews);

module.exports = router;
