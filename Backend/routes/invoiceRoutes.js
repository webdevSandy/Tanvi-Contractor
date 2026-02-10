const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoiceById, generatePDF, deleteInvoice, updateInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createInvoice)
    .get(protect, getInvoices);

router.route('/:id')
    .get(protect, getInvoiceById)
    .delete(protect, deleteInvoice)
    .put(protect, updateInvoice);

router.get('/:id/pdf', protect, generatePDF);

module.exports = router;
