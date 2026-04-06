const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const fs = require('fs');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const cats = await Category.find({});
    const output = cats.map(c => c.name).join('\n');
    fs.writeFileSync('categories.txt', output, 'utf8');
    console.log('Done');
    process.exit(0);
}
check();
