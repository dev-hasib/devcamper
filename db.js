const mongoose = require('mongoose');

const connectionDB = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
	});
	console.log(`DB connected on:   ${conn.connection.host}`.bgCyan.black);
};

module.exports = connectionDB;
