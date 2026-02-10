const getOTPTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .header { background-color: #002D5B; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; text-align: center; color: #333333; }
            .otp-code { font-size: 32px; font-weight: bold; color: #002D5B; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; font-size: 12px; color: #777777; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Tanvi Contractor Admin</h2>
            </div>
            <div class="content">
                <p>Hello Admin,</p>
                <p>You requested a login verification code. Please use the OTP below to complete your login:</p>
                <div class="otp-code">${otp}</div>
                <p>This code is valid for 2 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Tanvi Contractor. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { getOTPTemplate };
