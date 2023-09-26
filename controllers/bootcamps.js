const BootcampModel = require('../models/Bootcamp');

const getBootCamps = async (req, res, next) => {
	try {
		const bootCamps = await BootcampModel.find();
		res.status(200).json({
			success: true,
			result:bootCamps.length,
			msg: `this is the root ${req.url} of this application`,
			bootCamps,
		});
	} catch (error) {
		res.status(400).json({ success: false, msg: error.message });
	}
};

const getBootCamp = async (req, res, next) => {
	try {
		const bootCamp = await BootcampModel.findById(req.params.id);
		if (!bootCamp) {
			res.status(400).json({
				success: false,
				error,
				msg: `this is no. ${req.params.id} of this ${req.url} of this application`,
			});
		}
		res.status(200).json({ success: true, data: bootCamp });
	} catch (error) {
		res.status(400).json({
			success: false,
			error,
			msg: `this is no. ${req.params.id} of this ${req.url} of this application`,
		});
	}
};

const createBootCamp = async (req, res, next) => {
	try {
		const bootCamp = await BootcampModel.create(req.body);
		res.status(201).json({
			success: true,
			msg: `this is the post route ${req.url} of this application`,
			data: bootCamp,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

const updateBootCamp = async (req, res, next) => {
	const bootCamp = await BootcampModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	try {
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
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};

const deleteBootCamp =async (req, res, next) => {
	const bootCamp =await BootcampModel.findByIdAndDelete(req.params.id);
	try {
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
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};

module.exports = {
	getBootCamps,
	getBootCamp,
	createBootCamp,
	updateBootCamp,
	deleteBootCamp,
};
