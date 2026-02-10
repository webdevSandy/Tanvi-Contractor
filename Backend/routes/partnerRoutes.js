const express = require('express');
const router = express.Router();
const { createPartner, getPartners, updatePartner, deletePartner } = require('../controllers/partnerController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getPartners) // Publicly accessible to show on frontend
    .post(protect, upload.single('image'), createPartner); // Admin only

router.route('/:id')
    .put(protect, upload.single('image'), updatePartner)
    .delete(protect, deletePartner);

module.exports = router;
