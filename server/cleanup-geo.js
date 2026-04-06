require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Fix Users
        const users = await User.find({ 'location.type': 'Point', 'location.coordinates': { $exists: false } });
        console.log(`Found ${users.length} users with invalid location.`);
        for (const user of users) {
            user.location = undefined;
            await user.save();
        }

        // Fix Profiles
        const profiles = await Profile.find({ 'location.type': 'Point', 'location.coordinates': { $exists: false } });
        console.log(`Found ${profiles.length} profiles with invalid location.`);
        for (const profile of profiles) {
            profile.location = undefined;
            await profile.save();
        }

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
