const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ name: /banumathi/i });
    console.log(`Found ${users.length} users named banumathi:`);
    for (const u of users) {
        console.log(`- ID: ${u._id}`);
        console.log(`- Role: ${u.role}`);
        console.log(`- Email: ${u.email}`);
        console.log(`- is_verified: ${u.is_verified}`);
        console.log(`- Location: ${JSON.stringify(u.location)}`);
        
        const profile = await Profile.findOne({ user: u._id });
        if (profile) {
            console.log(`- Profile Category: ${profile.category}`);
            console.log(`- Profile Hourly Rate: ${profile.hourlyRate}`);
            console.log(`- Profile Location: ${JSON.stringify(profile.location)}`);
        } else {
            console.log(`- No Profile record found.`);
        }
    }
    process.exit(0);
}
check();
