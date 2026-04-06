const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const b = await Booking.find({ customer: '69c4c3d3bf8ffa8cbd27cca9' });
    console.log(`Bookings for ID 69c4c3d3bf8ffa8cbd27cca9: ${b.length}`);
    b.forEach(x => console.log(JSON.stringify(x)));
    process.exit(0);
}
check();
