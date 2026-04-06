const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get Public Stats (mirrors admin dashboard stats for home page)
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in-progress'] } });
        
        // We only show safe stats to the public
        res.json({
            totalUsers: totalUsers + 1000, // Added base for social proof
            activeBookings: activeBookings + 50,
            happyCustomers: '10k+'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
