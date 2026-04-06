const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dailyfix';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        let admin = await User.findOne({ email: 'admin@gmail.com' });

        if (admin) {
            console.log('Admin already exists. Updating password...');
            admin.password = 'password123';
            await admin.save();
        } else {
            console.log('Creating new admin user...');
            admin = new User({
                name: 'Admin User',
                email: 'admin@gmail.com',
                password: 'password123',
                role: 'admin'
            });
            await admin.save();
        }

        console.log('Admin credentials set:');
        console.log('Email: admin@gmail.com');
        console.log('Password: password123');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
