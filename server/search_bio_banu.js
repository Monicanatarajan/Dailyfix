const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const profiles = await Profile.find({}).populate('user');
    for (const p of profiles) {
        if (p.bio && /banu/i.test(p.bio)) {
            console.log(`MATCH IN BIO: Provider: "${p.user ? p.user.name : 'N/A'}", Bio: "${p.bio}"`);
        }
    }
    process.exit(0);
}
check();
