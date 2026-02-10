const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Connected');
    
    try {
        console.log('Attempting to create user...');
        const user = new User({
            username: 'debug_admin',
            password: 'password123',
            role: 'admin'
        });
        
        console.log('User instance created:', user);
        
        await user.save();
        console.log('User saved successfully');
    } catch (err) {
        console.error('Error saving user:', err);
        if (err.errors) {
            console.error('Validation errors:', JSON.stringify(err.errors, null, 2));
        }
    }
    
    process.exit();
})
.catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
