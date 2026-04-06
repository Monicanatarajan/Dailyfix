const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
require('dotenv').config();

const listBookings = async (customerEmail) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const customer = await User.findOne({ email: customerEmail });
        if (!customer) {
            console.log(`Customer ${customerEmail} not found.`);
            return;
        }

        const bookings = await Booking.find({ customer: customer._id }).populate('provider', 'name email role');
        console.log(`Bookings for ${customer.name} (${customer._id}):`);
        bookings.forEach(b => {
            console.log(`- Booking ID: ${b._id}`);
            console.log(`  Provider: ${b.provider ? b.provider.name : 'NULL'} (${b.provider ? b.provider._id : 'NULL'})`);
            console.log(`  Provider Role: ${b.provider ? b.provider.role : 'NULL'}`);
            console.log(`  Status: ${b.status}`);
            console.log(`  Created At: ${b.createdAt}`);
            console.log('---');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const email = process.argv[2] || 'marish@example.com'; // I'll search for the actual email
listBookings(email);
