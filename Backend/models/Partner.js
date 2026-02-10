const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String, // URL from Cloudinary
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
