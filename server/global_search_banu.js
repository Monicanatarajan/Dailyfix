const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Searching for "banu" in Users...');
    const users = await User.find({ $or: [{ name: /banu/i }, { email: /banu/i }] });
    users.forEach(u => console.log(`User: ${u.name}, Email: ${u.email}, Role: ${u.role}, ID: ${u._id}`));

    console.log('\nSearching for "banu" in Profiles (bio/category)...');
    const profiles = await Profile.find({ $or: [{ bio: /banu/i }, { category: /banu/i }] }).populate('user');
    profiles.forEach(p => console.log(`Profile User: ${p.user ? p.user.name : 'N/A'}, Category: ${p.category}, Bio: ${p.bio}`));

    process.exit(0);
}
check();
