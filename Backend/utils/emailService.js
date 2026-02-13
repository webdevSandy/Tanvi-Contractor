const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using the default SMTP transport
    // Check credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials missing in .env');
        throw new Error('Email credentials missing');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services or host/port
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS  // Your email password or app password
        },
        debug: true, // Show debug output
        logger: true, // Log information to console
        connectionTimeout: 10000 // 10 seconds timeout
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Tanvi Contractor Admin'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Send HTML if provided
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
