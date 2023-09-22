// logger
const logger = (req, res, next) => {
	console.log(
		`${req.method} ${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl}`
	);
	next();
};

module.exports = logger;
