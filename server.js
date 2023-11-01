require('dotenv').config();
require('colors');

//dependence functions
const express = require('express');
const expressFileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const expressMongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

//local utility functions
const connectionDB = require('./db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');

// local imports from local files
const bootCamp = require('./router/bootcamp');
const course = require('./router/course');
const auth = require('./router/auth');
const users = require('./router/users');
const review = require('./router/review');

const app = express();

// express built in middlewares
app.use(express.json());
app.use(expressFileUpload());
app.use(cookieParser());
app.use(expressMongoSanitize());
app.use(helmet());

//rateLimit
app.use(
	rateLimit({
		windowMs: 10 * 60 * 1000,
		max: 5,
		standardHeaders: true,
		legacyHeaders: true,
	})
);
//prevent http parameter pollutions
app.use(hpp());

// mount all api routers
app.use('/api/v1/bootcamp', bootCamp);
app.use('/api/v1/course', course);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', review);


//custom middlewares
app.use(logger);
app.use(errorHandler);

//use a static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server is running ${process.env.NODE_ENV} mode on port: ${PORT}`
			.bgMagenta.white
	);
});

connectionDB();
