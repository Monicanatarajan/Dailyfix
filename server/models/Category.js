const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String, default: 'FaWrench' } // Icon key from react-icons/fa
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
