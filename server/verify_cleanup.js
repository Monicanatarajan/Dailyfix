const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Booking = require('./models/Booking');

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const users = await User.find({ name: /rathisha/i });
        console.log(`Found ${users.length} users named rathisha:`);
        users.forEach(u => {
            console.log(`- ID: ${u._id}, Email: ${u.email}, Role: ${u.role}`);
        });

        const bookingsAsCustomer = await Booking.find({ customer: { $in: users.map(u => u._id) } });
        console.log(`Bookings where rathisha is customer: ${bookingsAsCustomer.length}`);

        if (users.length === 1 && users[0].role === 'provider' && bookingsAsCustomer.length === 0) {
            console.log('VERIFICATION SUCCESSFUL: Rathisha is strictly a provider with no customer data.');
        } else {
            console.log('VERIFICATION FAILED: Data still inconsistent.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
}

verify();
