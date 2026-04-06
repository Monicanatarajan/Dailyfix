const mongoose = require('mongoose');
const Profile = require('./models/Profile');
require('dotenv').config();

const findProfile = async (userId) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const profile = await Profile.findOne({ user: userId });
        if (profile) {
            console.log(`Profile found for user ${userId}:`);
            console.log(JSON.stringify(profile, null, 2));
        } else {
            console.log(`No profile found for user ${userId}.`);
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const userId = process.argv[2] || '69c4c3d3bf8ffa8cbd27cca9'; // Marish's ID
findProfile(userId);
