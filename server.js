require('dotenv').config();
const express = require('express');

// local imports from local files
const bootCamp = require('./router/bootcamp');
const connectionDB = require('./db');
const logger = require('./middleware/logger');

const app = express();

app.use(logger);
app.use('/api/v1/bootcamp/', bootCamp);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server is running ${process.env.NODE_ENV} mode on port: ${PORT}`
	);
});

connectionDB();
