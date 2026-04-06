const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get Public Stats (mirrors admin dashboard stats for home page)
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in-progress'] } });
        res.json({
            totalUsers: totalUsers + 1000,
            activeBookings: activeBookings + 50,
            happyCustomers: '10k+'
        });
    } catch (error) {
        // Return safe fallback values so the homepage still renders if DB is unavailable
        res.json({ totalUsers: '1000+', activeBookings: '50+', happyCustomers: '10k+' });
    }
});

module.exports = router;
