const getBootCamps = (req, res, next) => {
	res.json({
		success: true,
		msg: `this is the root ${req.url} of this application`,
	});
};

const getBootCamp = (req, res, next) => {
	res.json({
		success: true,
		msg: `this is no. ${req.params.id} of this ${req.url} of this application`,
	});
};

const createBootCamp = (req, res, next) => {
	res.json({
		success: true,
		msg: `this is the post route ${req.url} of this application`,
	});
};

const updateBootCamp = (req, res, next) => {
	res.json({
		success: true,
		msg: `Update id no.${req.params.id} of this ${req.url}`,
	});
};

const deleteBootCamp = (req, res, next) => {
	res.json({
		success: true,
		msg: `Delete id no.${req.params.id} of this ${req.url}`,
	});
};

module.exports = {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
}