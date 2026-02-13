const mongoose = require('mongoose');

const companyContactSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: false,
        default: '+91 123 456 7890'
    },
    email: {
        type: String,
        required: false,
        default: 'info@tanvicontractor.com'
    },
    address: {
        type: String,
        required: false,
        default: '123, Main Street, City, Country'
    },
    // Bank Details
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    branch: { type: String, default: '' },
    // Company Tax Info
    gstin: { type: String, default: '09ELJPK1174H2ZV' },
    pan: { type: String, default: 'ELJPK1174H' },
}, { timestamps: true });

// Ensure only one document exists
companyContactSchema.statics.getSingleton = async function () {
    const doc = await this.findOne();
    if (doc) {
        return doc;
    }
    return await this.create({});
};

module.exports = mongoose.model('CompanyContact', companyContactSchema);
