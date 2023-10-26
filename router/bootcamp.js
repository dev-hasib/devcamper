const express = require('express');

// local module
const {
	getBootCamp,
	getBootCamps,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
	getBootcampInRadius,
	uploadBootcampPhoto,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResult = require('../middleware/advancedResult');

//authentication middleware
const { protect, authorized } = require('../middleware/auth');

const { getCourse } = require('../controllers/course');

const router = express.Router();

router.route('/:bootcampId/course').get(getCourse);

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
