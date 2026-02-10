const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/emailService');
const { getOTPTemplate } = require('../utils/emailTemplates');
const crypto = require('crypto'); // Built-in node module
const { logActivity } = require('./activityLogController');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            email // Add email on registration if provided, though admin register flow might be manual
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // Check if 2FA is enabled
            if (user.twoFactorEnabled) {
                // Generate OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                
                // Hash OTP for security (optional but recommended) - simplistic approach here: storage
                // For simplicity in this demo, we'll store hash but compare carefully.
                // Reset expiry to 2 mins from now
                const expiry = new Date(Date.now() + 2 * 60 * 1000);

                user.twoFactorSecret = await bcrypt.hash(otp, 10);
                user.twoFactorExpiry = expiry;
                await user.save();

                // Send Email
                const message = `Your Admin Login OTP is: ${otp}.\nIt expires in 2 minutes.`;
                const html = getOTPTemplate(otp);

                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'Tanvi Admin Login OTP',
                        message,
                        html
                    });
                    
                    return res.json({
                        twoFactorRequired: true,
                        userId: user._id,
                        message: `OTP sent to ${user.email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => { 
                            for(let i = 0; i < gp3.length; i++) { 
                                gp2+= "*" 
                            } 
                            return gp2; 
                        })}`
                    });
                } catch (emailError) {
                    console.error(emailError);
                    return res.status(500).json({ message: 'Email could not be sent. Please contact support.' });
                }
            }

            // Normal Login
            await logActivity(user._id, user.username, 'LOGIN', { method: 'Password' }, req);

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.twoFactorSecret || !user.twoFactorExpiry) {
            return res.status(400).json({ message: 'No OTP requested' });
        }

        if (user.twoFactorExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const isMatch = await bcrypt.compare(otp, user.twoFactorSecret);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear OTP fields
        user.twoFactorSecret = undefined;
        user.twoFactorExpiry = undefined;
        await user.save();

        await logActivity(user._id, user.username, 'LOGIN', { method: '2FA' }, req);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Profile Routes ---

exports.getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user.id).select('-password -twoFactorSecret');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                 const salt = await bcrypt.genSalt(10);
                 user.password = await bcrypt.hash(req.body.password, salt);
            }
            
            if (req.file) {
                user.profileImage = req.file.path;
            }
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage, // Return new image URL
                twoFactorEnabled: updatedUser.twoFactorEnabled,
                token: generateToken(updatedUser._id) // Optional: refresh token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggle2FA = async (req, res) => {
    const { enable } = req.body; // true to enable, false to disable
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (enable) {
            // If enabling, verify email exists
            if (!user.email) {
                return res.status(400).json({ message: 'Please add an email address first' });
            }
            // Logic to verify email before enabling could go here (send OTP to verify), 
            // but for simplicity we will just enable it.
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ message: '2FA Enabled', twoFactorEnabled: true });
        } else {
            // Disable
            user.twoFactorEnabled = false;
            user.twoFactorSecret = undefined;
            user.twoFactorExpiry = undefined;
            await user.save();
            res.json({ message: '2FA Disabled', twoFactorEnabled: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
