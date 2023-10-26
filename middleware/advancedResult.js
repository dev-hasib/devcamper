/**
 *Advanced Searching query
 * @param {*} model Which model you want to get
 * @param {*} populate Which model you want to populate with
 * @returns
 */

const advancedResult = (model, populate) => {
	return async (req, res, next) => {
		let query;
		// Copy req queries
		let reqQuery = { ...req.query };

		// Field to exclude
		const removeFields = ['select', 'sort', 'page', 'limit'];

		// Loop over remove fields and delete them from the reqQuery
		removeFields.forEach((param) => delete reqQuery[param]);

		//Create Query string
		let queryStr = JSON.stringify(reqQuery);

		//Create operator for Mongo's query string
		let createMongoQueryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		// Finding resources in DB
		query = model.find(JSON.parse(createMongoQueryStr));

		// Select fields
		if (req.query.select) {
			const fields = req.query.select.split(',').join(' ');
			query = query.select(fields);
		}
		//Sorted fields
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		}

		// Pagination results
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await model.countDocuments();

		query = query.skip(startIndex).limit(limit);

		//populate model
		if (populate) {
			query.populate(populate);
		}
		// Executing queries
		const result = await query;
		// Pagination results
		const pagination = {};
		if (endIndex < total) {
			pagination.next = {
				next: page + 1,
				limit,
			};
		}
		if (startIndex > 0) {
			pagination.prev = {
				prev: page - 1,
				limit,
			};
		}
		res.advancedResult = {
			success: true,
			totalResult: result.length,
			pagination,
			result,
		};
		next();
	};
};

module.exports = advancedResult;
