const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware'); // Verify admin

// Map routes to controller methods
router.post('/', protect, quotationController.createQuotation);
router.get('/', protect, quotationController.getQuotations);
router.get('/:id', protect, quotationController.getQuotationById);
router.put('/:id', protect, quotationController.updateQuotation);
router.delete('/:id', protect, quotationController.deleteQuotation);

module.exports = router;
