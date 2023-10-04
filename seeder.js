const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

// Load model
const Bootcamp = require('./models/Bootcamp');

//Connect to MongoDB
const connect = mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
});

// read json file
const bootcamp = JSON.parse(
	fs.readFileSync(__dirname + '/_data/bootcamps.json', 'utf-8')
);

//import bootcamp in MongoDB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamp);
		console.log('Data created successfully!');
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

// delete bootcamp from mongodb
const deleteBootcamp = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log('Data deleted successfully!');
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteBootcamp();
}
