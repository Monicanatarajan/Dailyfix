const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from current directory (server)
dotenv.config({ path: path.join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const testEmail = async () => {
    console.log('Testing email delivery with config:');
    console.log('USER:', process.env.EMAIL_USER);
    console.log('PASS:', process.env.EMAIL_PASS ? '********' : 'NOT FOUND');

    const mailOptions = {
        from: `"Daily Fix Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self
        subject: 'Nodemailer Test Email',
        text: 'This is a test email from the Daily Fix debugging process.'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('❌ Email delivery failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        if (error.code === 'EAUTH') {
            console.error('HINT: This usually means the Gmail App Password is invalid or Google has blocked the sign-in.');
        }
    }
};

testEmail();
