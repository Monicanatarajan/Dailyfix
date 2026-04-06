const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'name email role is_verified');
    const output = users.map(u => `[${u.role}] ${u.name} <${u.email}> verified:${u.is_verified}`).join('\n');
    console.log(output);
    process.exit(0);
}
check();
