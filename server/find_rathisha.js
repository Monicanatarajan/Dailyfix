const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ name: /rathisha/i });
    console.log(`Found ${users.length} users with name rathisha:`);
    users.forEach(u => {
        console.log(`- ID: ${u._id}, Email: "${u.email}", Role: "${u.role}"`);
    });
    process.exit(0);
}
check();
