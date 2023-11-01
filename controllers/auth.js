const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const jwToken = require('../utils/jwt');
const userModel = require('../models/User');
const { hashPassword, matchPassword } = require('../utils/hash');
const getResetPasswordToken = require('../utils/resetpasswordhash');
const { sendEmail } = require('../utils/sendEmail');

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
		return next(new ErrorResponse('User not found', 404));
	}
	// password check
	const isMatch = await matchPassword(password, isUser.password);
	if (!isMatch) {
		return next(new ErrorResponse('Password not matched', 400));
	}
	sendTokenResponse(isUser, 200, res);
});

/**
 * @description Logout
 * @method GET
 * @route1 api/v1/auth/logout
 * @access Privet
 */
const logoutUser = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000) });

	res.status(200).json({
		success: true,
		user: {},
	});
});

/**
 * @description Update user details
 * @method PUT
 * @route1 api/v1/auth/me
 * @access Privet
 */
const updateUserDetails = asyncHandler(async (req, res, _next) => {
	const updateUserDetails = {
		name: req.body.name,
		email: req.body.email,
	};
	const user = await userModel.findByIdAndUpdate(
		req.user.id,
		updateUserDetails,
		{
			new: true,
			runValidators: true,
		}
	);
	sendTokenResponse(user, 200, res);
});

/**
 * @description update password
 * @method PUT
 * @route1 api/v1/auth/updatepassword
 * @access private
 */
const updatePassword = asyncHandler(async (req, res, next) => {
	const { oldPassword, password } = req.body;
	if (!oldPassword) {
		return next(
			new ErrorResponse('Please put your old password first!', 400)
		);
	}
	// validate email
	const isUser = await userModel
		.findOne({ email: req.user.email })
		.select('+password');
	// password check
	const isMatch = await matchPassword(oldPassword, isUser.password);
	if (!isMatch) {
		return next(new ErrorResponse('Password not matched!', 400));
	}

	await isUser.updateOne({ password: hashPassword(password) });

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

/**
 * @description Forget password
 * @method POST
 * @route1 api/v1/auth/forgotpassword
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await userModel.findOne({ email: req.body.email });
	if (!user) {
		return next(
			new ErrorResponse(
				'There is no user with email ' + req.body.email,
				404
			)
		);
	}

	//Get reset token
	const resetToken = await getResetPasswordToken(req.body.email);

	//reset URL
	const resetUrl = ` ${req.protocol}://${req.hostname}:${process.env.PORT}/api/v1/auth/resetpassword/${resetToken}`;

	//Options for send mail
	const options = {
		email: user.email,
		subject: 'No subject',
		txt: `You or someone are currently requesting to reset password please make a put request to ths given URL: ${resetUrl}`,
		html: resetUrl,
	};

	try {
		await sendEmail(options);
		res.status(200).json({
			success: true,
			message: 'Mail sent in to ' + user.email,
		});
	} catch (error) {
		console.log(error);
		return next(new ErrorResponse('There was an error to send mail', 400));
	}
});

/**
 * @description Reset the password
 * @method PUT
 * @route1 api/v1/auth/resetpassword/:resettoken
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
	//hashed reset token
	const hashed = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');

	const user = await userModel.findOne({
		resetPasswordToken: hashed,
		resetPasswordExpire: { $gt: Date.now() },
	});

	console.log(user.resetPasswordToken === hashed);

	if (!user) {
		return next(new ErrorResponse('Invalid token', 400));
	}

	await userModel.findOneAndUpdate(
		{ resetPasswordToken: hashed },
		{
			password: hashPassword(req.body.password),
			resetPasswordToken: '',
			resetPasswordExpire: null,
		}
	);
	sendTokenResponse(user, 201, res);
});

/**
 * Create token and send it to the cookie and give the response back
 * @param {object} Object Found user object
 * @param {Number} Number Given response status code
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

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	updateUserDetails,
	getMe,
	forgotPassword,
	resetPassword,
	updatePassword,
};
