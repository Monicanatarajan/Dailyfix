const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log('Total users:', users.length);
        console.log('Users:', JSON.stringify(users.map(u => ({ name: u.name, email: u.email, role: u.role })), null, 2));
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
