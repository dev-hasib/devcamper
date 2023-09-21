require('dotenv').config();
const express = require('express');

// local imports from local files
const bootCamp = require('./router/bootcamp');

const app = express();

app.use('/api/v1/bootcamp/', bootCamp);

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		msg: 'This is the root route of this application!',
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server is running ${process.env.NODE_ENV} mode on port: ${PORT}`
	);
});
