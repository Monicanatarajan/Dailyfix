const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
require('dotenv').config();

const listAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        for (const u of users) {
             const profile = await Profile.findOne({ user: u._id });
             console.log(`USER: ${u.name} | ROLE: ${u.role} | UNV_VERIFIED: ${u.is_verified} | EMAIL: ${u.email}`);
             if (profile) {
                 console.log(`  -> PROFILE: ${profile.category} | RATE: ${profile.hourlyRate} | ID: ${profile._id}`);
             } else {
                 console.log(`  -> NO PROFILE`);
             }
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listAll();
