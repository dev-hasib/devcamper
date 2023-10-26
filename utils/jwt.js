const jwt = require('jsonwebtoken');
/**
 * jsonwebtoken creator function
 * @param {payload} object Payload object
 * @returns jwt token
 */
const jwToken = ({ ...payload }) => {
	return jwt.sign(
		{
			...payload,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);
};

module.exports = jwToken;
