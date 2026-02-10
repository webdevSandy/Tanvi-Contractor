const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

console.log('Starting seed script...');
dotenv.config();
console.log('Env loaded. URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 'NULL');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Connected successfully');
    
    try {
        console.log('Checking for existing admin...');
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
        } else {
const bcrypt = require('bcryptjs');

// ... (inside async function)
            console.log('Creating new admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            const newUser = await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created:', newUser._id);
        }
        
        console.log('Exiting with success code 0');
        process.exit(0);
    } catch (innerErr) {
        console.error('Error during user operations:', innerErr);
        process.exit(1);
    }
})
.catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
