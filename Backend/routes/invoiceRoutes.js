const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoiceById, deleteInvoice, updateInvoice, getInvoiceStats } = require('../controllers/invoiceController.js');
const { protect } = require('../middleware/authMiddleware');

router.get('/date-stats', protect, getInvoiceStats);

router.route('/')
    .post(protect, createInvoice)
    .get(protect, getInvoices);

router.route('/:id')
    .get(protect, getInvoiceById)
    .delete(protect, deleteInvoice)
    .put(protect, updateInvoice);

module.exports = router;
