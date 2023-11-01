const router = require('express').Router();
const userModel = require('../models/User');
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/users');
//authentication middleware
const { protect, authorized } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const xssProtection = require('../middleware/xss-protect');

router.use(protect);
router.use(authorized('admin'));
router.use(xssProtection);

router.route('/').get(advancedResult(userModel), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
