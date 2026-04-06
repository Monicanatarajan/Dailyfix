require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'test_user_new_2@example.com' });
        console.log("User in DB:", JSON.stringify(user, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspect();
