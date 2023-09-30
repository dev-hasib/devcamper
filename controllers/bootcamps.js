const BootcampModel = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');

const getBootCamps = asyncHandler(async (req, res, next) => {
	const bootCamps = await BootcampModel.find();

	res.status(200).json({
		success: true,
		result: bootCamps.length,
		msg: `this is the root ${req.url} of this application`,
		bootCamps,
	});
});

const getBootCamp = asyncHandler(async (req, res, next) => {
	const bootCamp = await BootcampModel.findById(req.params.id);
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

const createBootCamp = asyncHandler(async (req, res, next) => {
	const bootCamp = await BootcampModel.create(req.body);
	res.status(201).json({
		success: true,
		msg: `this is the post route ${req.url} of this application`,
		data: bootCamp,
	});
});

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

const deleteBootCamp = asyncHandler(async (req, res, next) => {
	const bootCamp = await BootcampModel.findByIdAndDelete(req.params.id);
	if (!bootCamp) {
		res.status(400).json({
			success: false,
			data: null,
		});
	}
	res.status(200).json({
		success: true,
		data: {},
	});
});

module.exports = {
	getBootCamps,
	getBootCamp,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
};
