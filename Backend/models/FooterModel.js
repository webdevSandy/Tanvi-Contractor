const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
    facebook: {
        type: String,
        required: false,
        default: ''
    },
    instagram: {
        type: String,
        required: false,
        default: ''
    },
    twitter: {
        type: String,
        required: false,
        default: ''
    },
    linkedin: {
        type: String,
        required: false,
        default: ''
    },
    privacyPolicy: {
        type: String,
        required: false,
        default: ''
    },
    termsConditions: {
        type: String,
        required: false,
        default: ''
    },
    refundPolicy: {
        type: String,
        required: false,
        default: ''
    }
}, { timestamps: true });

// Ensure only one document exists
footerSchema.statics.getSingleton = async function () {
    const doc = await this.findOne();
    if (doc) {
        return doc;
    }
    return await this.create({});
};

module.exports = mongoose.model('Footer', footerSchema);
