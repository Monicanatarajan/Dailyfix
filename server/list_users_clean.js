const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        users.forEach(u => {
            console.log(`NAME: ${u.name} | EMAIL: ${u.email} | ID: ${u._id} | ROLE: ${u.role}`);
        });
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
