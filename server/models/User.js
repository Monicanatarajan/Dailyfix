const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
    isVerified: { type: Boolean, default: true }, // Verified by default since OTP is removed
    is_verified: { type: Boolean, default: false }, // Admin Verification purely for providers
    idProof: { type: String }, // Aadhaar or Photo ID
    profileImage: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }, // Avatar Image
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of favourite provider User IDs
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] } // [longitude, latitude]
    },
    phone: { type: String }, // Optional contact number
    address: {
        houseStreet: { type: String, default: '' },
        area: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' }
    },
    resetPasswordOtp: {
        code: String,
        expiresAt: Date
    },
    otp: { type: String },
    otpExpiresAt: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
