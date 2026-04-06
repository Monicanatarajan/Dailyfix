const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const u1 = await User.findById('67e3a9c9bf8ffa8cbd27cd8e');
    const u2 = await User.findById('69c4c3d3bf8ffa8cbd27cca9');
    console.log('User 1 (67e3a9c9bf8ffa8cbd27cd8e):', u1 ? JSON.stringify(u1) : 'NOT FOUND');
    console.log('User 2 (69c4c3d3bf8ffa8cbd27cca9):', u2 ? JSON.stringify(u2) : 'NOT FOUND');
    process.exit(0);
}
check();
