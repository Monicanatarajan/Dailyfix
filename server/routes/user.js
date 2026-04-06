const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get current user details including favourites
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -otp -resetPasswordOtp');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching user', error: err.message });
    }
});

// Toggle favourite provider
router.post('/favourites/:providerId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const providerId = req.params.providerId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isFavourited = user.favourites.includes(providerId);

        if (isFavourited) {
            // Remove from favourites
            user.favourites = user.favourites.filter(id => id.toString() !== providerId);
        } else {
            // Add to favourites
            user.favourites.push(providerId);
        }

        await user.save();
        res.json({ favourites: user.favourites, isFavourited: !isFavourited });
    } catch (err) {
        res.status(500).json({ message: 'Server error toggling favourite', error: err.message });
    }
});

// Get full details of favourite providers
router.get('/favourites', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get profiles for these favorite providers
        const Profile = require('../models/Profile'); // Ensure Profile model is available
        const populatedFavourites = await User.find({ _id: { $in: user.favourites } })
            .select('name email profileImage isVerified');

        const enrichedFavourites = await Promise.all(populatedFavourites.map(async (favMember) => {
            const profile = await Profile.findOne({ user: favMember._id });
            return {
                ...favMember.toObject(),
                profileId: profile?._id,
                category: profile?.category || 'N/A',
                rating: profile?.rating || 0,
                hourlyRate: profile?.hourlyRate || 0
            };
        }));

        res.json(enrichedFavourites);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching favourites', error: err.message });
    }
});

module.exports = router;

