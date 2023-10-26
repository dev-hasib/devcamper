const express = require('express');
const {
	createCourse,
	getCourses,
	getCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/course');
const Course = require('../models/Course');
const advancedResult = require('../middleware/advancedResult');
const { protect, authorized } = require('../middleware/auth');

const router = express.Router();
//this rout is get all courses for the bootcamp
router.route('/').get(
	advancedResult(Course, {
		path: 'bootcamp',
		select: 'name housing',
	}),
	getCourses
);
router
	.route('/:bootcampId/course')
	.post(protect, authorized('admin', 'publisher'), createCourse);
router
	.route('/:id')
	.get(getCourse)
	.put(protect, authorized('admin', 'publisher'), updateCourse)
	.delete(protect, authorized('admin', 'publisher'), deleteCourse);

	// this route is specified a single course 
router.route('bootcamp/:bootcampId/course').get(getCourses);

module.exports = router;
