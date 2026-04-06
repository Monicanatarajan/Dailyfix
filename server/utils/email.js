const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ SMTP Connection Error:', error.message);
    } else {
        console.log('✅ SMTP Server is ready to take our messages');
    }
});


const sendOTP = async (email, otp) => {
    // ALWAYS log OTP to console as a fallback
    console.log('-----------------------------------');
    console.log(`OTP FOR ${email}: ${otp}`);
    console.log('-----------------------------------');

    const mailOptions = {
        from: `"Daily Fix" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Access OTP',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    };

    try {
        console.log(`Attempting to send email to ${email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);
        console.log(`Message ID: ${info.messageId}`);
        console.log(`SMTP Response: ${info.response}`);
    } catch (error) {
        console.error(`❌ Email delivery failed to ${email}`);
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Code: ${error.code}`);
        if (error.code === 'EAUTH') {
            console.error('HINT: EAUTH error usually means the Gmail App Password is invalid or Google has blocked the sign-in.');
        }
        console.log('User can still use the OTP printed above to complete registration.');
    }

};

module.exports = { sendOTP };
