const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findById('69c4c3d3bf8ffa8cbd27cca9');
    console.log(`User by ID 69c4c3d3bf8ffa8cbd27cca9: ${user ? JSON.stringify(user) : 'NOT FOUND'}`);
    process.exit(0);
}
check();
