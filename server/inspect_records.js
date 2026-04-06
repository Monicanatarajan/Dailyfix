const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Booking = require('./models/Booking');
require('dotenv').config();

const inspectRecords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('--- USERS ---');
        const users = await User.find({ name: { $in: [/vinitha/i, /marish/i] } });
        users.forEach(u => console.log(`User: ${u.name}, ID: ${u._id}, Role: ${u.role}, is_verified: ${u.is_verified}`));

        const userIds = users.map(u => u._id);
        
        console.log('\n--- PROFILES ---');
        const profiles = await Profile.find({ user: { $in: userIds } });
        profiles.forEach(p => console.log(`Profile ID: ${p._id}, Linked User ID: ${p.user}, Category: ${p.category}`));

        const profileIds = profiles.map(p => p._id);

        console.log('\n--- BOOKINGS ---');
        const bookings = await Booking.find({});
        for (const b of bookings) {
            console.log(`Booking ID: ${b._id}`);
            console.log(`  Provider ID in Booking: ${b.provider}`);
            console.log(`  Customer ID in Booking: ${b.customer}`);
            console.log(`  Status: ${b.status}`);
            
            const providerUser = await User.findById(b.provider);
            const customerUser = await User.findById(b.customer);
            
            console.log(`  Actual Provider Name: ${providerUser ? providerUser.name : 'UNKNOWN'}`);
            console.log(`  Actual Customer Name: ${customerUser ? customerUser.name : 'UNKNOWN'}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

inspectRecords();
