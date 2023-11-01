const crypto = require('crypto');
const user = require('../models/User');

/**
 * @description Forget password
 * @param {object} requestOject Request object
 * @returns Reset password token
 */
const getResetPasswordToken = async function (email) {
	//generate token using crypto
	const resetToken = crypto.randomBytes(20).toString('hex');

	//create hash token and set in into User model resetPasswordToken field
	const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

	//set expiration
	const expiration = Date.now() + 10 * 60 * 1000;

	await user.findOneAndUpdate(
		{ email: email },
		{
			resetPasswordToken: hash,
			resetPasswordExpire: expiration,
		}
	);

	return resetToken;
};

module.exports = getResetPasswordToken;
