const express = require('express');

// local module
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const {
	getBootCamp,
	getBootCamps,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
	getBootcampInRadius,
	uploadBootcampPhoto,
} = require('../controllers/bootcamps');
const { getCourse } = require('../controllers/course');
const { getAllReviews, addReviews } = require('../controllers/review');

//authentication middleware
const { protect, authorized } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const xssProtection = require('../middleware/xss-protect');
//xss attack protection
router.use(xssProtection);

router.route('/:bootcampId/course').get(getCourse);

//Reviews routes that depend on bootcamp model
router.route('/:bootcampId/reviews').get(getAllReviews);
router
	.route('/:bootcampId/reviews')
	.post(protect, authorized('user', 'admin'), addReviews);

// CRUD operations routes
router
	.route('/')
	.get(advancedResult(Bootcamp, 'courses'), getBootCamps)
	.post(protect, authorized('publisher', 'admin'), createBootCamp);
router
	.route('/:id')
	.get(getBootCamp)
	.put(protect, authorized('publisher', 'admin'), updateBootCamp)
	.delete(protect, authorized('publisher', 'admin'), deleteBootCamp);

//bootcamp photo upload route
router
	.route('/:id/photo')
	.put(protect, authorized('publisher', 'admin'), uploadBootcampPhoto);

//radius operations route
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

module.exports = router;
