const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dailyfix';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const admins = await User.find({ role: 'admin' });
        if (admins.length > 0) {
            console.log('Admin Users Found:');
            admins.forEach(admin => {
                console.log(`- Name: ${admin.name}, Email: ${admin.email}`);
            });
        } else {
            console.log('No admin users found.');
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
