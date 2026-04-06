const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace');
        console.log('Connected to MongoDB');
        
        const user = await User.findOne({ email: 'harini@gmail.com' });
        if (!user) {
            console.log('User harini@gmail.com not found');
        } else {
            user.password = 'password123';
            await user.save();
            console.log('Password for harini@gmail.com has been reset to: password123');
        }
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
