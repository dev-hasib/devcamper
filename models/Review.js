const { Schema, model } = require('mongoose');
const BootcampModel = require('./Bootcamp.js');

const ReviewSchema = new Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add a title for your review!'],
		maxlength: 100,
	},
	text: {
		type: String,
		required: [true, 'Please add some text about our bootcamp!'],
	},
	rating: {
		type: Number,
		required: [true, 'Please add review between 1 to 10'],
		min: 1,
		max: 10,
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

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//Static method to get average cost for tuition
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: '$bootcamp',
				averageRating: { $avg: '$rating' },
			},
		},
	]);
	try {
		await BootcampModel.findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageRating,
		});
		console.log(obj);
	} catch (error) {
		console.log(error);
	}
};

//Call getAverageRating function
ReviewSchema.post('save', function () {
	this.constructor.getAverageRating(this.bootcamp);
});

//Call getAverageRating function
ReviewSchema.post('findOneAndUpdate', function () {
	this.model.getAverageRating(this.bootcamp);
});

//Call getAverageRating function
ReviewSchema.pre('findOneAndDelete', function (next) {
	this.model.getAverageRating(this.bootcamp);
	next();
});

const ReviewModel = model('review', ReviewSchema);

module.exports = ReviewModel;
