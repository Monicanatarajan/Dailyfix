const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10);
    console.log('Last 10 users:');
    users.forEach(u => console.log(`- ${u.name} <${u.email}> [${u.role}] Created: ${u.createdAt}`));
    process.exit(0);
}
check();
