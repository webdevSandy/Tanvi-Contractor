const { Resend } = require('resend');

const sendEmail = async (options) => {

    // ✅ Ensure environment variables exist
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY missing in environment variables');
        throw new Error('Email credentials missing');
    }

    // ✅ Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        let fromEmail = 'onboarding@resend.dev';
        // Only use custom domain if explicitly set and it's not the dummy one
        if (process.env.FROM_EMAIL && process.env.FROM_EMAIL !== 'your_email@yourdomain.com') {
             fromEmail = process.env.FROM_EMAIL;
        }

        const { data, error } = await resend.emails.send({
            from: `${process.env.FROM_NAME || 'Tanvi Contractor Admin'} <${fromEmail}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        });

        if (error) {
            console.error("Email sending failed:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data?.id);
        return { messageId: data?.id };
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

module.exports = sendEmail;