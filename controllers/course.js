const CourseModel = require('../models/Course');
const BootcampModel = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');

/**
 * @description Get courses
 * @method GET
 * @route1 api/v1/course
 * @route2 api/v1/bootcamp/:bootcampId/course
 * @access public
 */
const getCourses = asyncHandler(async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = CourseModel.find({ bootcamp: req.params.bootcampId });
	} else {
		query = CourseModel.find().populate({
			path: 'bootcamp',
			select: 'name housing',
			// match: { housing: true },
		});
	}
	const course = await query;

	res.status(200).json({
		success: true,
		result: course.length,
		data: course,
	});
});

/**
 * @description Get courses
 * @method GET
 * @route1 api/v1/course/:id
 * @access public
 */
const getCourse = asyncHandler(async (req, res, next) => {
	let course = await CourseModel.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!course) {
		return next(
			new ErrorResponse(
				`Course is not found of this id :${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		result: course.length,
		data: course,
	});
});

/**
 * @description Create new courses
 * @method POST
 * @route1 api/v1/course/:bootcampId/course
 * @access Privet
 */
const createCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	let bootcamp = await BootcampModel.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp is not found of this id :${req.params.bootcampId}`,
				404
			)
		);
	}
	const course = await CourseModel.create(req.body);
	res.status(200).json({
		success: true,
		result: course,
	});
});

/**
 * @description Update courses
 * @method PUT
 * @route1 api/v1/course/:id
 * @access public
 */
const updateCourse = asyncHandler(async (req, res, next) => {
	let course = CourseModel.findById(req.params.id);
	if (!course) {
		return next(
			new ErrorResponse(
				`Course is not found of this id :${req.params.id}`,
				404
			)
		);
	}
	course = await CourseModel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	}).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	res.status(200).json({
		success: true,
		result: course.length,
		data: course,
	});
});

/**
 * @description Delete courses
 * @method Delete
 * @route1 api/v1/course/:id
 * @access public
 */
const deleteCourse = asyncHandler(async (req, res, next) => {
	let course = await CourseModel.findOneAndDelete({
		_id: req.params.id,
	});
	if (!course) {
		return next(
			ErrorResponse(
				`Course is not exist of this id :${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		result: 'Deleted successfully',
		data: {},
	});
});

module.exports = {
	getCourses,
	getCourse,
	updateCourse,
	createCourse,
	deleteCourse,
};
