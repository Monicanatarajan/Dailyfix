const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace');
        console.log('Connected to MongoDB');
        
        const users = await User.find({}, 'name email role');
        console.log('Registered Users JSON:');
        console.log(JSON.stringify(users, null, 2));
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
