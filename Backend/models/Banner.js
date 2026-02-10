const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    image: {
        type: String, // URL from Cloudinary
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
