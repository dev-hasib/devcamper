const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name!'],
			unique: true,
			trim: true,
			maxlength: [50, 'Name must between 50 characters'],
		},
		slug: String,
		description: {
			type: String,
			required: [true, 'Please add a description!'],
			maxlength: [500, 'Description must between 500 characters'],
		},
		website: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Please use a valid url with http or https',
			],
		},
		phone: {
			type: String,
			maxlength: [
				20,
				'Phone Number can not be longer than 14 characters',
			],
		},
		email: {
			type: String,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please enter a valid email address',
			],
		},
		address: {
			type: String,
			required: [true, 'Please add an address'],
		},
		location: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
				index: '2dsphere',
			},
			formattedAddress: String,
			street: String,
			city: String,
			state: String,
			zipcode: String,
			country: String,
		},
		careers: {
			type: [String],
			required: true,
			enum: [
				'Web Development',
				'Mobile Development',
				'UI/UX',
				'Data Science',
				'Business',
				'Other',
			],
		},
		averageRating: {
			type: Number,
			min: [1, 'Rating must be at least 1'],
			max: [10, 'Rating must be at most 10'],
		},
		averageCost: Number,
		photo: {
			type: String,
			default: 'no-photo.jpg',
		},
		housing: {
			type: Boolean,
			default: false,
		},
		jobAssistance: {
			type: Boolean,
			default: false,
		},
		jobGuarantee: {
			type: Boolean,
			default: false,
		},
		acceptGi: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		user: {
			type: Schema.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true, trim: true });
	console.log(this.slug);
	next();
});

// Geo code create location field
BootcampSchema.pre('save', async function (next) {
	const geocode = await geocoder.geocode(this.address);
	this.location = {
		type: 'Point',
		coordinates: [geocode[0].latitude, geocode[0].longitude],
		formattedAddress: geocode[0].formattedAddress,
		street: geocode[0].streetName,
		city: geocode[0].city,
		state: geocode[0].stateCode,
		zipcode: geocode[0].zipcode,
		country: geocode[0].countryCode,
	};
	next();
});

//populate virtual
BootcampSchema.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'bootcamp',
	justOne: false,
});

// //populate virtual
// BootcampSchema.virtual('reviews', {
// 	ref: 'Review',
// 	localField: '_id',
// 	foreignField: 'bootcamp',
// 	justOne: false,
// });


const BootcampModel = model('Bootcamp', BootcampSchema);

module.exports = BootcampModel;
