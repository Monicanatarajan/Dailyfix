const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const getOtp = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email });
        if (user) {
            console.log(`-----------------------------------`);
            console.log(`OTP FOR ${email}: ${user.otp}`);
            console.log(`EXPIRES AT: ${user.otpExpiresAt}`);
            console.log(`-----------------------------------`);
        } else {
            console.log(`User ${email} not found.`);
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const email = process.argv[2] || 'nvbhargavi2@gmail.com';
getOtp(email);
