const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ name: /banu/i });
    console.log(`Found ${users.length} users like "banu":`);
    users.forEach(u => {
        console.log(`- ID: ${u._id}, Name: "${u.name}", Role: "${u.role}", Email: "${u.email}", Verified: ${u.is_verified}`);
    });
    process.exit(0);
}
check();
