const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // Import configured upload

router.route('/')
    .get(getAbout)
    .put(protect, upload.single('image'), updateAbout);

module.exports = router;
