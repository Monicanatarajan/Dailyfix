const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check all users
    const users = await User.find({});
    console.log(`Total users in DB: ${users.length}`);
    for (const u of users) {
        if (/banu/i.test(u.name)) {
            console.log(`MATCH: Name: "${u.name}", Email: "${u.email}", Role: "${u.role}", Verified: ${u.is_verified}`);
        }
    }

    // Check providers without profiles
    const providers = await User.find({ role: 'provider' });
    console.log(`\nProviders count: ${providers.length}`);
    for (const u of providers) {
        const profile = await Profile.findOne({ user: u._id });
        if (!profile) {
            console.log(`Provider WITHOUT PROFILE: Name: "${u.name}", ID: ${u._id}`);
        }
    }

    process.exit(0);
}
check();
