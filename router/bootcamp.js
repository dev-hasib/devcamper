const express = require('express');

// local module
const {
	getBootCamp,
	getBootCamps,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/').get(getBootCamps).post(createBootCamp);
router
	.route('/:id')
	.get(getBootCamp)
	.put(updateBootCamp)
	.delete(deleteBootCamp);

module.exports = router;
