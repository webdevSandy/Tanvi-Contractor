const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    points: {
        type: [String],
        default: []
    },
    image: {
        type: String, // URL from Cloudinary
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
