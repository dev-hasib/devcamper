const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const jwToken = require('../utils/jwt');
const userModel = require('../models/User');
const { hashPassword, matchPassword } = require('../utils/hash');

/**
 * @description Register a new user
 * @method post
 * @route1 api/v1/auth/register
 * @access public
 */
const registerUser = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	const user = await userModel.create({
		name,
		email,
		password: hashPassword(password),
		role,
	});
	sendTokenResponse(user, 201, res);
});

/**
 * @description Login user
 * @method post
 * @route1 api/v1/auth/login
 * @access public
 */
const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new ErrorResponse('Fields must not be empty', 400));
	}
	// validate email
	const isUser = await userModel.findOne({ email }).select('+password');
	if (!isUser) {
		return next(new ErrorResponse('Invalid credentials', 404));
	}
	// password check
	const isMatch = await matchPassword(password, isUser.password);
	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 400));
	}
	sendTokenResponse(isUser, 200, res);
});

/**
 * @description Get me
 * @method GET
 * @route1 api/v1/auth/me
 * @access Privet
 */
const getMe = asyncHandler(async (req, res, next) => {
	const user = await userModel.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
});

module.exports = {
	registerUser,
	loginUser,
	getMe,
};

/**
 * Create token and send it to the cookie and give the response back
 * @param {object} Object Found user object
 * @param {Number} Number Given user status
 * @param {object} Object response object
 */
const sendTokenResponse = (user, statusCode, res) => {
	const token = jwToken({ name: user.name, id: user._id });

	const options = {
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	res.status(statusCode).cookie('token', token, options).json({
		message: 'Login successful!',
		token,
	});
};
