const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ name: /vanu/i });
    console.log(`Found ${users.length} users like "vanu":`);
    users.forEach(u => console.log(`- ${u.name} <${u.email}> [${u.role}]`));
    process.exit(0);
}
check();
