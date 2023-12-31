const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, _req, res, _next) => {
	let error = { ...err };
	error.message = err.message;
	console.log(err);

	// mongoose CastError for the bad ObjectID
	if (err.name === 'CastError') {
		const message = `Resource not found `;
		error = new ErrorResponse(message, 404);
	}

	//mongoose ServerError for the duplicate resource
	if (err.code === 11000) {
		const message = `The user has already added in our database! Duplicate resource detected!`;
		error = new ErrorResponse(message, 400);
	}

	// mongoose Validation Error for required fields
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map(({ message }) => message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Resource not found!',
	});
};

module.exports = errorHandler;
