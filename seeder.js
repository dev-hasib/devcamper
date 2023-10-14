const fs = require('fs');
require('dotenv').config();
require('colors');
const mongoose = require('mongoose');

// Load model
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//Connect to MongoDB
const connect = mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
});

// read json file of bootcamp
const bootcamp = JSON.parse(
	fs.readFileSync(__dirname + '/_data/bootcamps.json', 'utf-8')
);
//read json file of course
const course = JSON.parse(
	fs.readFileSync(__dirname + '/_data/courses.json', 'utf-8')
);

//import bootcamp in MongoDB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamp);
		await Course.create(course);
		console.log('Data created successfully!'.bgGreen.black);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

// delete bootcamp from mongodb
const deleteBootcamp = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();

		console.log('Data deleted successfully!'.bgRed.white);
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
