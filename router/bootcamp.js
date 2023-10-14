const express = require('express');

// local module
const {
	getBootCamp,
	getBootCamps,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
	getBootcampInRadius,
} = require('../controllers/bootcamps');

const { getCourse } = require('../controllers/course');

const router = express.Router();

router.route('/:bootcampId/course').get(getCourse);

// CRUD operations routes
router.route('/').get(getBootCamps).post(createBootCamp);
router
	.route('/:id')
	.get(getBootCamp)
	.put(updateBootCamp)
	.delete(deleteBootCamp);

//radius operations route
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

module.exports = router;
