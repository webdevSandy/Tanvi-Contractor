const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');
        
        const user = await User.findOne({ username: 'Sandy' });
        if (user) {
            console.log('--------------------------------------------------');
            console.log('User found:', user.username);
            console.log('Email:', user.email);
            console.log('2FA Enabled:', user.twoFactorEnabled);
            console.log('--------------------------------------------------');

            const sendEmail = require('./utils/emailService');
            console.log(`Attempting to send email to ${user.email}...`);
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Test Email to User Sandy',
                    message: 'If you receive this, the email address in DB is correct and working.',
                    html: '<p>If you receive this, the <b>email address in DB is correct and working</b>.</p>'
                });
                console.log('SUCCESS: Email sent to user!');
            } catch (err) {
                console.error('FAILURE: Could not send email to user.', err);
            }

        } else {
            console.log('User Sandy not found');
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUser();
