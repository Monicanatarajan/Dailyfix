const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User'); // Register User model
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const profiles = await Profile.find({ category: /^A/i }).populate('user');
    console.log(`Found ${profiles.length} profiles with "A" categories:`);
    profiles.forEach(p => {
        if (p.user) {
            console.log(`- Provider: "${p.user.name}", Category: "${p.category}", Email: "${p.user.email}", Verified: ${p.user.is_verified}`);
        } else {
            console.log(`- Profile ID: ${p._id} has NO LINKED USER`);
        }
    });
    process.exit(0);
}
check();
