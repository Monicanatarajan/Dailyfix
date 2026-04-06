const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const fs = require('fs');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'name email role');
    const output = users.map(u => `Name: "${u.name}", Email: "${u.email}", Role: "${u.role}"`).join('\n');
    fs.writeFileSync('all_user_names.txt', output, 'utf8');
    console.log('Done');
    process.exit(0);
}
check();
