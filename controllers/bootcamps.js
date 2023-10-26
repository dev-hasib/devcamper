const BootcampModel = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const geocoder = require('../utils/geocoder');
const Course = require('../models/Course');
const path = require('path');

/**
 * @description Get all bootcamp
 * @route DELETE api/v1/bootcamp/
 * @access public
 */
const getBootCamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResult);
});

/**
 * @description Get a single bootcamp
 * @route GET api/v1/bootcamp/:id
 * @access privet
 */
const getBootCamp = asyncHandler(async (req, res, next) => {
	let query = { ...req.query };
	let data;
	// remove query from the query string
	const removeQuery = ['select'];

	// Delete query from the query string
	removeQuery.forEach((pram) => delete query[pram]);

	// finding resource in db
	data = BootcampModel.findById(req.params.id).populate({
		path: 'courses',
	});

	if (req.query.select) {
		const field = req.query.select.split(',').join(' ');
		data.select(field);
	}

	const bootCamp = await data;

	if (!bootCamp) {
		next(
			new ErrorResponse(
				`Resource not found in the ${req.params.id} id`,
				404
			)
		);
	}
	res.status(200).json({ success: true, data: bootCamp });
});

/**
 * @description Create bootcamp
 * @method POST
 * @route api/v1/bootcamp/
 * @access public
 */
const createBootCamp = asyncHandler(async (req, res, next) => {
	// add user to req.body
	req.body.user = req.user.id;

	//if the user is not the admin he can create only one bootcamp
	const bootcampPublished = BootcampModel.findOne({ user: req.user.id });

	if (bootcampPublished && req.user.role !== 'admin') {
		return next(new ErrorResponse('You can create only one bootcamp', 400));
	}

	const bootCamp = await BootcampModel.create(req.body);
	res.status(201).json({
		success: true,
		msg: `this is the post route ${req.url} of this application`,
		data: bootCamp,
	});
});

/**
 * @description Update bootcamp
 * @route PUT api/v1/bootcamp/:id
 * @access privet
 */
const updateBootCamp = asyncHandler(async (req, res, next) => {
	let bootCamp = await BootcampModel.findById(req.params.id);
	//check the user is the author of this bootcamp

	if (bootCamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				'The user is not authorized to update this bootcamp',
				400
			)
		);
	}

	if (!bootCamp) {
		res.status(400).json({
			success: false,
			data: null,
		});
	}
	bootCamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		success: true,
		data: bootCamp,
	});
});

/**
 * @description delete bootcamp
 * @route DELETE api/v1/bootcamp/:id
 * @access privet
 */
const deleteBootCamp = asyncHandler(async function (req, res, next) {
	const bootCamp = await BootcampModel.findOne({
		_id: req.params.id,
	});

	if (bootCamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				'The user is not authorized to delete this bootcamp',
				400
			)
		);
	}

	if (!bootCamp) {
		res.status(400).json({
			success: false,
			data: null,
		});
	}

	await bootCamp.deleteOne();
	await Course.deleteMany({ bootcamp: bootCamp._id });

	res.status(200).json({
		success: true,
		data: `Bootcamp deleted successfully for this id ${req.params.id}`,
	});
});

/**
 * @description Get bootcamp within a radius
 * @method GET
 * @route api/v1/bootcamp/radius/:zipcode/:distance
 * @param zipcode - The zipcode of the bootcamp
 * @param distance - The distance of the bootcamp
 * @access privet
 */
const getBootcampInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	console.log(zipcode, distance);

	//Get latitude and longitude from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lon = loc[0].longitude;
	console.log(lat, lon);

	// Calculate radius using radiance
	// Divide distance by radius fo earth
	// Earth radius = 3,963 mils / 6,378 km

	const radius = distance / 3963.2; //mils

	console.log(radius);

	const bootcamps = await BootcampModel.find({
		location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
	});
	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
		lat: lat,
		lon: lon,
	});
	console.log(bootcamps);
});

/**
 * @description Upload bootcamp photo
 * @route PUT api/v1/bootcamp/:id/photo
 * @access privet
 */
const uploadBootcampPhoto = asyncHandler(async function (req, res, next) {
	const bootCamp = await BootcampModel.findOne({
		_id: req.params.id,
	});

	if (bootCamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				'The user is not authorized to update this bootcamp',
				400
			)
		);
	}

	if (!bootCamp) {
		return next(new ErrorResponse('bootcamp not found of this id', 400));
	}
	if (!req.files) {
		return next(new ErrorResponse('Please upload a file!', 400));
	}
	const file = req.files.file;

	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse('Please upload an image file!', 400));
	}
	if (file.size > 1024 * 1024) {
		return next(new ErrorResponse('File size is too large!', 400));
	}

	file.name = `photo_${bootCamp._id}${path.parse(file.name).ext}`;

	file.mv(`./public/uploads/${file.name}`, async (error) => {
		if (error) {
			new ErrorResponse('An error occurred while uploading', 500);
		}
		await BootcampModel.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});
		res.status(201).json({
			success: true,
			data: file.name,
		});
	});
});

module.exports = {
	getBootCamps,
	getBootCamp,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
	getBootcampInRadius,
	uploadBootcampPhoto,
};