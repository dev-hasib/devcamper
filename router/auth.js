const router = require('express').Router();
const {
	registerUser,
	loginUser,
	logoutUser,
	updateUserDetails,
	updatePassword,
	getMe,
	forgotPassword,
	resetPassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateUserDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);




module.exports = router;
