const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    email: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined if we have existing users without email initially, though for admin it should be required eventually.
    },
    profileImage: {
        type: String
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String // We will store the hashed OTP here
    },
    twoFactorExpiry: {
        type: Date
    }
});

module.exports = mongoose.model('User', userSchema);
