const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const jwToken = require('../utils/jwt');
const userModel = require('../models/User');
const { hashPassword, matchPassword } = require('../utils/hash');

/**
 * @description Get all users with advanced query
 * @method GET
 * @route1 api/v1/auth/users
 * @access Privet(admin)
 */
const getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResult);
});

/**
 * @description Get single user
 * @method GET
 * @route1 api/v1/auth/users/:id
 * @access Privet(admin)
 */
const getUser = asyncHandler(async (req, res, next) => {
	const user = await userModel.findById(req.params.id);
	res.status(200).json({
		success: true,
		user,
	});
});

/**
 * @description Create new user account
 * @method POST
 * @route1 api/v1/auth/users
 * @access Privet(admin)
 */
const createUser = asyncHandler(async (req, res, next) => {
	req.body.password = hashPassword(req.body.password);
	const newUser = await userModel.create(req.body);
	res.status(200).json({
		success: true,
		newUser,
	});
});

/**
 * @description Update user profile
 * @method PUT
 * @route1 api/v1/auth/users:/id
 * @access Privet(admin)
 */
const updateUser = asyncHandler(async (req, res, next) => {
	const user = await userModel.findById(req.params.id);
	if (!user) {
		return next(new ErrorResponse('User not found', 404));
	}
	await user.updateOne(req.body, {
		new: true,
		runValidator: true,
	});
	res.status(200).json({
		success: true,
		user,
	});
});

/**
 * @description Delete user from the database
 * @route1 api/v1/auth/users:/id
 * @access Privet(admin)
 */
const deleteUser = asyncHandler(async (req, res, next) => {
	await userModel.findByIdAndDelete(req.params.id);
	res.status(200).json({
		message: 'User deleted successfully',
		user: {},
	});
});

module.exports = {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
};
