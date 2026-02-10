const express = require('express');
const router = express.Router();
const { createContact, getContacts, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(createContact)
    .get(protect, getContacts);

router.route('/:id')
    .delete(protect, deleteContact);

module.exports = router;
