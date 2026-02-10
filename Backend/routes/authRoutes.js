const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP, getProfile, updateProfile, toggle2FA } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists, standard

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

const { upload } = require('../config/cloudinary');

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, upload.single('profileImage'), updateProfile);

router.post('/toggle-2fa', protect, toggle2FA);

module.exports = router;
