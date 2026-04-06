const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // e.g., Plumber, Electrician
    hourlyRate: { type: Number, required: true },
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    bio: { type: String },
    experience: { type: Number, default: 0 }, // Years of experience
    services: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, default: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop' }, // Default service image
            rating: { type: Number, default: 4.5 }
        }
    ]
}, { timestamps: true });

profileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Profile', profileSchema);
