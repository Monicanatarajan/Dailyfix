const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const User = require('./models/User');
require('dotenv').config();

const searchProviders = async (category) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Use a dummy location for Bangalore
        const coordinates = [80.1601, 13.064]; 
        const maxDistance = 50 * 1000; // 50km

        const pipeline = [
            {
                $geoNear: {
                    near: { type: 'Point', coordinates },
                    distanceField: 'distance',
                    maxDistance,
                    spherical: true
                }
            }
        ];

        if (category) {
            pipeline.push({ $match: { category } });
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $match: { 'user.isVerified': true } },
            {
                $project: {
                    'user.name': 1,
                    'user.email': 1,
                    'user.role': 1,
                    'category': 1
                }
            }
        );

        const providers = await Profile.aggregate(pipeline);
        console.log(`Found ${providers.length} providers for category ${category}:`);
        providers.forEach(p => {
            console.log(`- NAME: ${p.user.name} | ROLE: ${p.user.role} | CATEGORY: ${p.category} | PROFILE_ID: ${p._id} | USER_ID: ${p.user._id}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const category = process.argv[2] || 'beautician';
searchProviders(category);
