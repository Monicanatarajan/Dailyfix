const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const categories = [
    { name: 'Plumber', description: 'Pipe fitting, repair, and maintenance' },
    { name: 'Electrician', description: 'Wiring, lighting, and electrical repairs' },
    { name: 'Carpenter', description: 'Woodwork, furniture repair, and installation' },
    { name: 'Cleaner', description: 'House and office cleaning services' },
    { name: 'Painter', description: 'Interior and exterior painting' },
    { name: 'AC Technician', description: 'Air conditioning repair and servicing' }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { name: cat.name },
                cat,
                { upsert: true, new: true }
            );
        }

        console.log('Successfully seeded categories!');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
