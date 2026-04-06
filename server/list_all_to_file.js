const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const listAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        let output = '';
        for (const u of users) {
             const profile = await Profile.findOne({ user: u._id });
             output += `USER: ${u.name} | ROLE: ${u.role} | UNV_VERIFIED: ${u.is_verified} | ID: ${u._id} | EMAIL: ${u.email}\n`;
             if (profile) {
                 output += `  -> PROFILE: ${profile.category} | RATE: ${profile.hourlyRate} | ID: ${profile._id}\n`;
             } else {
                 output += `  -> NO PROFILE\n`;
             }
        }
        const outputPath = path.join(__dirname, 'debug_output.txt');
        fs.writeFileSync(outputPath, output);
        await mongoose.connection.close();
        console.log(`Output written to ${outputPath}`);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listAll();
