const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'name email role');
    console.log(`Total users: ${users.length}`);
    users.forEach(u => {
        console.log(`- Name: "${u.name}", Email: "${u.email}", Role: "${u.role}"`);
    });
    process.exit(0);
}
check();
