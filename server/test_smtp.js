const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const testMail = async () => {
    try {
        console.log('Testing SMTP with:', process.env.EMAIL_USER);
        await transporter.verify();
        console.log('SMTP Connection Successful!');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'SMTP Test',
            text: 'This is a test email.'
        };
        await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('SMTP Connection Failed:', error.message);
    }
};

testMail();
