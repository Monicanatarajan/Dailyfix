const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'name email role is_verified');
    console.log(`Total users: ${users.length}`);
    users.forEach(u => {
        console.log(`[${u.role}] ${u.name} <${u.email}> verified:${u.is_verified}`);
    });
    process.exit(0);
}
check();
