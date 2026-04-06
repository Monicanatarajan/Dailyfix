const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');

mongoose.connect('mongodb://127.0.0.1:27017/marketplace').then(async () => {
    try {
        const u = await User.findOne({name: { $regex: new RegExp('neela', 'i') }});
        if (u) {
            console.log('User found:', u.name);
            let p = await Profile.findOne({user: u._id});
            if (!p) {
                console.log('Profile not found, creating one...');
                p = new Profile({ user: u._id });
            }
            p.category = 'Painter';
            p.location = { type: 'Point', coordinates: [77.5946, 12.9716] }; // Near Bangalore
            await p.save();
            console.log('Profile updated to Painter and location set!');
        } else {
            console.log('User neela totally not found');
        }
    } catch(err) {
        console.log(err);
    }
    process.exit(0);
});
