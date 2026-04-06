const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    bookingId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    message:    { type: String, required: true },
    read:       { type: Boolean, default: false }
}, { timestamps: true });

// Index for booking-scoped chat history
messageSchema.index({ bookingId: 1, createdAt: 1 });
// Index for general peer-to-peer chat history (legacy support)
messageSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model('Message', messageSchema);
