const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Please enter your name...'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Please enter your email...'],
		unique: [true, 'The email is already used...'],
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please enter a valid email address',
		],
	},
	role: {
		type: String,
		enum: ['user', 'publisher'],
		default: 'user',
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const userModel = model('User', userSchema);

module.exports = userModel;
