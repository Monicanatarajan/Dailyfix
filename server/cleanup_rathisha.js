const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Booking = require('./models/Booking');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const customerEmail = 'dailyfixsd@gmail.com';
        const customerUser = await User.findOne({ email: customerEmail, role: 'customer' });
        
        if (!customerUser) {
            console.log(`No customer user found with email ${customerEmail}`);
            process.exit(0);
        }

        const customerId = customerUser._id;
        console.log(`Found customer rathisha with ID: ${customerId}`);

        // Delete bookings
        const bookingDeleteResult = await Booking.deleteMany({ customer: customerId });
        console.log(`Deleted ${bookingDeleteResult.deletedCount} bookings for customer ID ${customerId}`);

        // Delete user
        const userDeleteResult = await User.deleteOne({ _id: customerId });
        console.log(`Deleted user rathisha (customer) with ID ${customerId}`);

        console.log('Cleanup completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

cleanup();
