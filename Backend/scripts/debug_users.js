const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Connected');
    
    try {
        const users = await User.find({});
        console.log('Users found:', users.map(u => ({ username: u.username, role: u.role })));
    } catch (err) {
        console.error('Error finding users:', err);
    }
    
    process.exit();
})
.catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
});
