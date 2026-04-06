const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    amount: { type: Number, required: true },
    commissionAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    transactionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
