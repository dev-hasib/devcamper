require('dotenv').config();
require('colors');

//dependence functions
const express = require('express');
const expressFileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

//local utility functions
const connectionDB = require('./db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');

// local imports from local files
const bootCamp = require('./router/bootcamp');
const course = require('./router/course');
const auth = require('./router/auth');

const app = express();

// express built in middlewares
app.use(express.json());
app.use(expressFileUpload());
app.use(cookieParser());

// api routers
app.use('/api/v1/bootcamp', bootCamp);
app.use('/api/v1/course', course);
app.use('/api/v1/auth', auth);

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
