const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
require('dotenv').config();

const listCoords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ name: { $in: [/vinitha/i, /marish/i] } });
        for (const u of users) {
             const profile = await Profile.findOne({ user: u._id });
             console.log(`USER: ${u.name} | ROLE: ${u.role} | ID: ${u._id}`);
             if (profile && profile.location) {
                 console.log(`  -> PROFILE LOCATION: ${JSON.stringify(profile.location.coordinates)}`);
             } else {
                 console.log(`  -> NO PROFILE LOCATION`);
             }
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listCoords();
