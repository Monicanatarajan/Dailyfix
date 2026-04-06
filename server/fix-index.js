require('dotenv').config();
const mongoose = require('mongoose');

const fixIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        // Drop index on users
        try {
            await db.collection('users').dropIndex('location_2dsphere');
            console.log("Dropped location_2dsphere from users");
        } catch (e) { console.log("Index location_2dsphere not found on users or already dropped"); }

        // Recreate as sparse
        await db.collection('users').createIndex({ location: '2dsphere' }, { sparse: true });
        console.log("Created sparse 2dsphere index on users");

        // Drop index on profiles
        try {
            await db.collection('profiles').dropIndex('location_2dsphere');
            console.log("Dropped location_2dsphere from profiles");
        } catch (e) { console.log("Index location_2dsphere not found on profiles or already dropped"); }

        await db.collection('profiles').createIndex({ location: '2dsphere' }, { sparse: true });
        console.log("Created sparse 2dsphere index on profiles");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixIndex();
