const CompanyContact = require('../models/CompanyContactModel');

// @desc    Get company contact info
// @route   GET /api/company-contact
// @access  Public
exports.getContactInfo = async (req, res) => {
    try {
        const contact = await CompanyContact.getSingleton();
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update company contact info
// @route   PUT /api/company-contact
// @access  Private/Admin
exports.updateContactInfo = async (req, res) => {
    const { phone, email, address, accountName, accountNumber, ifscCode, bankName, branch, gstin, pan, activeTemplate } = req.body;

    try {
        const contact = await CompanyContact.getSingleton();

        contact.phone = phone || contact.phone;
        contact.email = email || contact.email;
        contact.address = address || contact.address;
        
        // Update Bank Details
        contact.accountName = accountName || contact.accountName;
        contact.accountNumber = accountNumber || contact.accountNumber;
        contact.ifscCode = ifscCode || contact.ifscCode;
        contact.bankName = bankName || contact.bankName;
        contact.branch = branch || contact.branch;

        // Update Tax Info
        contact.gstin = gstin || contact.gstin;
        contact.pan = pan || contact.pan;
        
        // Update Template Preference
        contact.activeTemplate = activeTemplate || contact.activeTemplate;

        const updatedContact = await contact.save();
        res.json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
