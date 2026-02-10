const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'About us'
    },
    description: {
        type: String,
        required: true,
        default: 'Welcome to our website.'
    },
    image: {
        type: String,
        required: false
    },
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
    }
}, { timestamps: true });

// Ensure only one document exists
aboutSchema.statics.getSingleton = async function () {
    const doc = await this.findOne();
    if (doc) {
        return doc;
    }
    return await this.create({});
};

module.exports = mongoose.model('About', aboutSchema);
