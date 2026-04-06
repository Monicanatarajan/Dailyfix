const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ name: /rathisha/i, role: 'customer' });
    console.log(`Found ${users.length} customer users named rathisha`);
    process.exit(0);
}
check();
