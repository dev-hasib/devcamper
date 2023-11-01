const ReviewModel = require('../models/Review');
const BootcampModel = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');

/**
 * @description Get all reviews
 * @method GET
 * @route1 api/v1/reviews
 * @route2 api/v1/bootcamp/:bootcampId/reviews
 * @access public
 */
const getAllReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await ReviewModel.find({
			bootcamp: req.params.bootcampId,
		});
		res.status(200).json({
			success: true,
			totalResult: reviews.length,
			result: reviews,
		});
	}
	res.status(200).json(res.advancedResult);
});

/**
 * @description Get a single reviews
 * @method GET
 * @route1 api/v1/reviews/:id
 * @access public
 */
const getSingleReviews = asyncHandler(async (req, res, next) => {
	const reviews = await ReviewModel.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!reviews) {
		return next(new ErrorResponse('No reviews found with this id!', 404));
	}
	res.status(200).json({
		success: true,
		result: reviews,
	});
});

/**
 * @description Add review
 * @method POST
 * @route1 api/v1/bootcamp/:bootcampId
 * @access public
 */
const addReviews = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;
	const bootcamp = await BootcampModel.findById(req.params.bootcampId);
	if (!bootcamp) {
		return next(new ErrorResponse('Bootcamp not found with this id!', 404));
	}
	// const isReviewed = await ReviewModel.findOne({ user: req.user.id });
	// if (isReviewed) {
	// 	return next(
	// 		new ErrorResponse(
	// 			`You already reviewed (${isReviewed.rating}) one time`,
	// 			404
	// 		)
	// 	);
	// }
	const review = await ReviewModel.create(req.body);

	res.status(200).json({
		success: true,
		result: review,
	});
});

/**
 * @description Update review
 * @method PUT
 * @route1 api/v1/reviews/:id
 * @access Privet
 */
const updateReviews = asyncHandler(async (req, res, next) => {
	let reviews = await ReviewModel.findById(req.params.id);
	if (!reviews) {
		return next(new ErrorResponse('No reviews found with this id!', 404));
	}

	if (reviews.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				'User is unauthorized to update this review!',
				404
			)
		);
	}

	reviews = await ReviewModel.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		success: true,
		result: reviews,
	});
});

/**
 * @description Delete review
 * @method DELETE
 * @route1 api/v1/reviews/:id
 * @access Privet
 */
const deleteReviews = asyncHandler(async (req, res, next) => {
	let reviews = await ReviewModel.findById(req.params.id);
	if (!reviews) {
		return next(new ErrorResponse('No reviews found with this id!', 404));
	}

	if (reviews.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				'User is unauthorized to delete this review!',
				404
			)
		);
	}

	await ReviewModel.findOneAndDelete({ _id: req.params.id });

	res.status(200).json({
		success: true,
		reviews: {},
	});
});

module.exports = {
	getAllReviews,
	getSingleReviews,
	addReviews,
	updateReviews,
	deleteReviews,
};
