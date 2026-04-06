const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dailyfix';

async function checkAccount() {
    try {
        await mongoose.connect(MONGO_URI);
        const customers = await User.find({ role: 'customer' }).limit(1);
        if (customers.length > 0) {
            console.log(`Customer: ${customers[0].email}`);
            // Password might be hashed, so we might need to reset it
            customers[0].password = 'password123';
            await customers[0].save();
            console.log('Password reset to password123 for ' + customers[0].email);
        } else {
            console.log('No customers found. Creating one.');
            const newCustomer = new User({
                name: 'Test Customer',
                email: 'customer@gmail.com',
                password: 'password123',
                role: 'customer'
            });
            await newCustomer.save();
            console.log('Created customer@gmail.com / password123');
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

checkAccount();
