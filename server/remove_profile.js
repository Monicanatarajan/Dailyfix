const mongoose = require('mongoose');
const Profile = require('./models/Profile');
require('dotenv').config();

const removeProfile = async (userId) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Profile.deleteOne({ user: userId });
        console.log(`Deleted ${result.deletedCount} profile(s) for user ${userId}.`);
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const userId = process.argv[2];
if (!userId) {
    console.error('Usage: node remove_profile.js <userId>');
    process.exit(1);
}
removeProfile(userId);
