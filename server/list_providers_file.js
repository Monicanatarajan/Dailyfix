const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const profiles = await Profile.find({}).populate('user', 'name email role is_verified location');
    const output = profiles.map(p => {
        if (p.user) {
            return `Provider: "${p.user.name}", Category: "${p.category}", Email: "${p.user.email}", Verified: ${p.user.is_verified}, Location: ${JSON.stringify(p.user.location)}`;
        } else {
            return `Profile ID: ${p._id} has NO LINKED USER`;
        }
    }).join('\n');
    console.log(output);
    process.exit(0);
}
check();
