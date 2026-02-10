const express = require('express');
const router = express.Router();
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .post(protect, upload.single('image'), createService)
    .get(getServices);

router.route('/:id')
    .put(protect, upload.single('image'), updateService)
    .delete(protect, deleteService);

module.exports = router;
