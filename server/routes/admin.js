const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// Get Dashboard Data
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in-progress'] } });
        const totalVolume = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const grossVolume = totalVolume.length > 0 ? totalVolume[0].total : 0;
        const revenue = grossVolume * 0.10;

        res.json({
            totalUsers,
            activeBookings,
            grossVolume,
            revenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle Provider Verification
router.patch('/verify-user/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.is_verified = !user.is_verified;
        await user.save();

        res.json({ message: `Verification status updated to ${user.is_verified}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Users (including provider categories)
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const Profile = require('../models/Profile');

        const enrichedUsers = await Promise.all(users.map(async (u) => {
            const userObj = u.toObject();
            if (u.role === 'provider') {
                const profile = await Profile.findOne({ user: u._id });
                userObj.category = profile?.category || 'N/A';
            }
            return userObj;
        }));

        res.json(enrichedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Master Transaction Ledger
router.get('/transactions', protect, authorize('admin'), async (req, res) => {
    try {
        const transactions = await Booking.find().populate('customer provider', 'name email').sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin - Category Management
router.get('/categories', protect, async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/categories', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const category = new Category({ name, description, icon: icon || 'FaWrench' });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/categories/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin - Review Management
router.get('/reviews', protect, authorize('admin'), async (req, res) => {
    try {
        const Review = require('../models/Review');
        const reviews = await Review.find()
            .populate('customer', 'name')
            .populate('provider', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/reviews/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const Review = require('../models/Review');
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

