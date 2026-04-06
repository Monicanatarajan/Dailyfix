const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const profiles = await Profile.find({}).populate('user', 'name email role is_verified location');
    console.log(`Total provider profiles: ${profiles.length}`);
    profiles.forEach(p => {
        if (p.user) {
            console.log(`- Provider: "${p.user.name}", Category: "${p.category}", Email: "${p.user.email}", Verified: ${p.user.is_verified}`);
            console.log(`  Location: ${JSON.stringify(p.user.location)}`);
        } else {
            console.log(`- Profile ID: ${p._id} has NO LINKED USER`);
        }
    });
    process.exit(0);
}
check();
