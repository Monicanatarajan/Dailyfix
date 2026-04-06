const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find all users who are providers
    const providers = await User.find({ role: 'provider' });
    console.log(`Found ${providers.length} provider users:`);
    for (const u of providers) {
        const profile = await Profile.findOne({ user: u._id });
        console.log(`- ID: ${u._id}, Name: "${u.name}", Email: "${u.email}", Verified: ${u.is_verified}, Profile Cat: ${profile ? profile.category : 'NONE'}`);
    }
    process.exit(0);
}
check();
