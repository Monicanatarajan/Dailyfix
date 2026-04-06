const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const deleteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'malarcomputer2020@gmail.com';
        const result = await User.deleteOne({ email });
        console.log(`Deleted user ${email}:`, result.deletedCount > 0 ? 'Success' : 'Not found');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteUser();
