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

const router = express.Router();
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
