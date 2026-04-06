const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');

// @route   GET /api/profile
// @desc    Get current user profile (includes provider details if role is provider)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profileData = { user };

        if (user.role === 'provider') {
            const providerProfile = await Profile.findOne({ user: req.user.id });
            if (providerProfile) {
                profileData.providerDetails = providerProfile;
            }
        }

        res.json(profileData);
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// @route   PUT /api/profile/update
// @desc    Update user profile & address (and provider details if applicable)
// @access  Private
router.put('/update', protect, upload.single('profileImage'), async (req, res) => {
    try {
        const {
            name, phone, houseStreet, area, city, state, pincode, // User fields
            category, experience, hourlyRate, bio, services // Provider fields
        } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update User Details
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;

        // Update Address
        if (!user.address) user.address = {};
        if (houseStreet !== undefined) user.address.houseStreet = houseStreet;
        if (area !== undefined) user.address.area = area;
        if (city !== undefined) user.address.city = city;
        if (state !== undefined) user.address.state = state;
        if (pincode !== undefined) user.address.pincode = pincode;

        // Handle Image Upload
        if (req.file) {
            // Delete old image if it's not the default avatar to save space
            if (user.profileImage && !user.profileImage.startsWith('http')) {
                const oldImagePath = path.join(__dirname, '..', user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Save the relative path mapped via our static folder in index.js
            user.profileImage = `/uploads/profile/${req.file.filename}`;
        }

        await user.save();

        let updatedProfile = null;
        // Update Provider Specific Details
        if (user.role === 'provider') {
            let providerProfile = await Profile.findOne({ user: req.user.id });
            
            // Upsert / Create if missing
            if (!providerProfile) {
                providerProfile = new Profile({
                    user: req.user.id,
                    category: category || 'General',
                    hourlyRate: Number(hourlyRate) || 0,
                    location: user.location || { type: 'Point', coordinates: [0, 0] }
                });
            }

            if (category) providerProfile.category = category;
            if (experience !== undefined && experience !== '') providerProfile.experience = Number(experience) || 0;
            if (hourlyRate !== undefined && hourlyRate !== '') providerProfile.hourlyRate = Number(hourlyRate) || 0;
            if (bio !== undefined) providerProfile.bio = bio;
            
            // Handle Services Array
            if (services) {
                try {
                    // It might come as a stringified JSON from FormData
                    const parsedServices = typeof services === 'string' ? JSON.parse(services) : services;
                    providerProfile.services = parsedServices;
                } catch (e) {
                    console.error("Failed to parse services JSON", e);
                }
            }
            
            await providerProfile.save();
            updatedProfile = providerProfile;
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage
            },
            providerDetails: updatedProfile
        });

    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

module.exports = router;
