const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // minlength:8 ensures the random temp password always passes validation
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
    isVerified: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },
    idProof: { type: String },
    profileImage: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] }
    },
    phone: { type: String },
    address: {
        houseStreet: { type: String, default: '' },
        area:        { type: String, default: '' },
        city:        { type: String, default: '' },
        state:       { type: String, default: '' },
        pincode:     { type: String, default: '' }
    },
    resetPasswordOtp: {
        code:      String,
        expiresAt: Date
    },
    otp:          { type: String },
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
