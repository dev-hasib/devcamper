const xss = require('xss');

const xssProtection = (req, res, next) => {
	req.body = xssProtect(req.body);
	next();
};

/**
 * XSS protection
 * @param {data} Data which data should be filtered
 * @returns filtered data
 */
const xssProtect = (data) => {
	if (typeof data === 'object') {
		let filtered = { ...data };
		Object.keys(filtered).forEach((key) => {
			if (typeof filtered[key] === 'string') {
				filtered[key] = xss(filtered[key]);
			}
		});
		return filtered;
	} else {
		return xss(data);
	}
};

module.exports = xssProtection;
