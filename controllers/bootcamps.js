const BootcampModel = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const geocoder = require('../utils/geocoder');
const Course = require('../models/Course');

/**
 * @description Get all bootcamp
 * @route DELETE api/v1/bootcamp/
 * @access public
 */
const getBootCamps = asyncHandler(async (req, res, next) => {
	let query;
	// Copy req queries
	let reqQuery = { ...req.query };

	// Field to exclude
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// Loop over remove fields and delete them from the reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	//Create Query string
	let queryStr = JSON.stringify(reqQuery);

	//Create operator for Mongo's query string
	let createMongoQueryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// Finding resources in DB
	query = BootcampModel.find(JSON.parse(createMongoQueryStr)).populate({
		path: 'courses',
	});

	// Select fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}
	//Sorted fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	}

	// Pagination results
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await BootcampModel.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Executing queries
	const bootCamps = await query;

	// Pagination results
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			next: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			prev: page - 1,
			limit,
		};
	}
	res.status(200).json({
		success: true,
		resultCount: bootCamps.length,
		url: `${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl}`,
		pagination,
		msg: `this is the root ${req.url} of this application`,
		bootCamps,
	});
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
				`Resource not found in the ${req.params.id} url`,
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
	const bootCamp = await BootcampModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	if (!bootCamp) {
		res.status(400).json({
			success: false,
			data: null,
		});
	}
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
		data: { bootCamp },
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

module.exports = {
	getBootCamps,
	getBootCamp,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
	getBootcampInRadius,
};