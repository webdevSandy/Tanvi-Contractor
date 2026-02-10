const express = require('express');
const router = express.Router();
const { createBanner, getBanners, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getBanners) // Publicly accessible for Hero section
    .post(protect, upload.single('image'), createBanner); // Admin only

router.route('/:id')
    .put(protect, upload.single('image'), updateBanner)
    .delete(protect, deleteBanner);

module.exports = router;
