const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const customerId = '69c4c3d3bf8ffa8cbd27cca9';
        
        // Delete bookings where this ID is the customer
        const result = await Booking.deleteMany({ customer: customerId });
        console.log(`Deleted ${result.deletedCount} bookings where ID ${customerId} was the customer.`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

cleanup();
