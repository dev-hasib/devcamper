require('dotenv').config();
const express = require('express');
const colors = require('colors');

// local imports from local files
const bootCamp = require('./router/bootcamp');
const connectionDB = require('./db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');

const app = express();

// express built in middlewares
app.use(express.json());

//custom middlewares
app.use(logger);

app.use('/api/v1/bootcamp/', bootCamp);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server is running ${process.env.NODE_ENV} mode on port: ${PORT}`
			.bgMagenta.white
	);
});

connectionDB();
