const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// Create or Update Profile
router.post('/profile', protect, authorize('provider', 'admin'), async (req, res) => {
    try {
        const { category, hourlyRate, location, bio } = req.body;
        let profile = await Profile.findOne({ user: req.user._id });

        if (profile) {
            profile.category = category;
            profile.hourlyRate = hourlyRate;
            profile.location = location;
            profile.bio = bio;
            await profile.save();
        } else {
            profile = new Profile({
                user: req.user._id,
                category,
                hourlyRate,
                location,
                bio
            });
            await profile.save();
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get My Profile
router.get('/profile/me', protect, authorize('provider', 'admin'), async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).lean();
        if (profile) {
            // Include user address and name from req.user
            profile.user = {
                name: req.user.name,
                address: req.user.address
            };
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Incoming Bookings
router.get('/bookings', protect, authorize('provider', 'admin'), async (req, res) => {
    try {
        const bookings = await Booking.find({ provider: req.user._id })
            .populate('customer', 'name email profileImage');

        // Normalize customer profileImage URLs
        const normalized = bookings.map(b => {
            const obj = b.toObject();
            if (obj.customer?.profileImage?.startsWith('/uploads')) {
                obj.customer.profileImage = `http://localhost:5001${obj.customer.profileImage}`;
            }
            return obj;
        });

        res.json(normalized);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Booking Status
router.patch('/bookings/:id', protect, authorize('provider', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking || booking.provider.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
