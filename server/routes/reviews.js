const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Profile = require('../models/Profile');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// Submit a Review
router.post('/', protect, authorize('customer'), async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking || booking.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        const existingReview = await Review.findOne({ booking: bookingId, customer: req.user._id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }

        const review = new Review({
            booking: bookingId,
            customer: req.user._id,
            provider: booking.provider,
            rating,
            comment
        });

        await review.save();

        // Update Provider Profile Rating
        const reviews = await Review.find({ provider: booking.provider });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await Profile.findOneAndUpdate(
            { user: booking.provider },
            { rating: avgRating, reviewCount: reviews.length }
        );

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get review for a specific booking
router.get('/booking/:bookingId', protect, async (req, res) => {
    try {
        const review = await Review.findOne({ booking: req.params.bookingId, customer: req.user._id });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit an existing Review
router.put('/:id', protect, authorize('customer'), async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findOne({ _id: req.params.id, customer: req.user._id });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        // Update Provider Profile Rating
        const reviews = await Review.find({ provider: review.provider });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await Profile.findOneAndUpdate(
            { user: review.provider },
            { rating: avgRating, reviewCount: reviews.length }
        );

        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reviews for a provider
router.get('/:providerId', async (req, res) => {
    try {
        const reviews = await Review.find({ provider: req.params.providerId })
            .populate('customer', 'name profileImage');

        // Normalize profileImage URLs
        const normalized = reviews.map(r => {
            const obj = r.toObject();
            if (obj.customer?.profileImage?.startsWith('/uploads')) {
                obj.customer.profileImage = `http://localhost:5001${obj.customer.profileImage}`;
            }
            if (!obj.customer?.profileImage) {
                if (obj.customer) obj.customer.profileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }
            return obj;
        });

        res.json(normalized);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
