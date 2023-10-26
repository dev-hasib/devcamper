const bcrypt = require('bcryptjs');
/**
 * password hashing algorithm used to encrypt passwords
 * @param {password} password
 * @returns hash of password
 */
const hashPassword = function (password) {
	const salt = bcrypt.genSaltSync(10);
	const hashPassword = bcrypt.hashSync(password, salt);
	return hashPassword;
};

/**
 * match password with db hash password
 * @param {password} password
 * @returns boolean
 */
const matchPassword = function (matchPassword, hashPassword) {
	return bcrypt.compare(matchPassword, hashPassword);
};

module.exports = { hashPassword, matchPassword };
