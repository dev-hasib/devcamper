const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');

/**
 * @description Protect the authenticated user
 * @route1 * all privet routes
 * @access privet
 */

const protect = asyncHandler(async (req, _res, next) => {
	let token;

	// Check for token in Authorization header
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	// If no token in Authorization header, check for token in cookies
	else if (req.cookies.token) {
		token = req.cookies.token;
	}

	// Make sure a valid token is present
	if (!token) {
		return next(
			new ErrorResponse('Not authorized to access this route!', 401)
		);
	}

	// Verify the authorization token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		return next(new ErrorResponse('Unauthorized', 401));
	}
});


/**
 * @description Role based authentication
 * @route1 *all privet routes
 * @access private
 */
const authorized = (...roles) => {
	return (req, _res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`That ${req.user.role} dose not the permissions  to take that action`,
					403
				)
			);
		}
		next();
	};
};

module.exports = { protect, authorized };
