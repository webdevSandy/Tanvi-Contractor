const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Connected');
    
    try {
        const username = 'admin';
        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.findOne({ username });
        if (user) {
            user.password = hashedPassword;
            await user.save();
            console.log(`User ${username} password reset to ${password}`);
        } else {
            user = await User.create({
                username,
                password: hashedPassword,
                role: 'admin'
            });
            console.log(`User ${username} created with password ${password}`);
        }
    } catch (err) {
        console.error('Error resetting user:', err);
    }
    
    process.exit();
})
.catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
