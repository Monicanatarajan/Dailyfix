const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dailyfix';

async function checkProviders() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const providers = await Profile.find().populate('user');
        console.log(`Found ${providers.length} providers`);

        providers.forEach(p => {
            console.log(`Provider: ${p.user?.name}`);
            console.log(`Address: ${JSON.stringify(p.user?.address)}`);
            console.log(`Location: ${JSON.stringify(p.user?.location)}`);
            console.log('---');
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

checkProviders();
