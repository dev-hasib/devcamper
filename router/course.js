const express = require('express');
const {
	createCourse,
	getCourses,
	getCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/course');

const router = express.Router();

router.route('/').get(getCourses);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);
router.route('/:bootcampId/course').post(createCourse);

router.route('bootcamp/:bootcampId/course').get(getCourses);
module.exports = router;
