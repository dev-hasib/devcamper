const { Schema, model } = require('mongoose');
const BootcampModel = require('./Bootcamp.js');

const Course = new Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add a title!'],
	},
	description: {
		type: String,
		required: [true, 'Please add a description'],
	},
	weeks: {
		type: String,
		required: [true, 'Please add number of weeks'],
	},
	tuition: {
		type: Number,
		required: [true, 'Please add a tuition cost!'],
	},
	minimumSkill: {
		type: String,
		enum: ['beginner', 'intermediate', 'advanced'],
		required: [true, 'Please add your minimum skill level'],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: Schema.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

//Static method to get average cost for tuition
Course.statics.getAverageCost = async function (bootcampId) {
	console.log('Calculating average cost '.green);
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' },
			},
		},
	]);
	try {
		await BootcampModel.findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost * 10) / 10,
		});
	} catch (error) {
		console.log(error);
	}
};

//Call getAverageCost function
Course.post('save', function () {
	this.constructor.getAverageCost(this.bootcamp);
});

//Call getAverageCost function
Course.pre('findOneAndDelete', function (next) {
	this.model.getAverageCost(this.bootcamp);
	console.log(this.model);
	next();
});

const CourseSchema = model('Course', Course);

module.exports = CourseSchema;
