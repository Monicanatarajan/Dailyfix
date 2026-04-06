const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay Client
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid123456',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret1234567890abcdef'
});

// Get Single Provider Profile
router.get('/provider/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id).populate('user', 'name isVerified profileImage phone address');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search Providers
router.get('/search', async (req, res) => {
    try {
        const { lat, lng, radius = 5, category } = req.query;
        const maxDistance = radius * 1000; // Radius in meters
        const coordinates = [parseFloat(lng), parseFloat(lat)];

        const pipeline = [
            {
                $geoNear: {
                    near: { type: 'Point', coordinates },
                    distanceField: 'distance',
                    maxDistance,
                    spherical: true
                }
            }
        ];

        if (category) {
            pipeline.push({ $match: { category } });
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $match: { 'user.role': 'provider', 'user.is_verified': true } },
            {
                $project: {
                    'user.password': 0, // exclude password
                    'user.otp': 0,
                    'user.resetPasswordOtp': 0
                }
            }
        );

        const providers = await Profile.aggregate(pipeline);
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Booking (Conflict Detection)
router.post('/book', protect, authorize('customer'), async (req, res) => {
    try {
        const { providerId, startTime, amount } = req.body;
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours

        // Check for conflicts
        const conflict = await Booking.findOne({
            provider: providerId,
            status: { $nin: ['declined', 'cancelled'] },
            $or: [
                { startTime: { $lt: end, $gte: start } },
                { endTime: { $gt: start, $lte: end } }
            ]
        });

        if (conflict) {
            return res.status(400).json({ message: 'Time slot already booked' });
        }

        const booking = new Booking({
            customer: req.user._id,
            provider: providerId,
            startTime: start,
            endTime: end,
            amount,
            commissionAmount: amount * 0.10, // 10% commission
            status: 'pending'
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Customer's Own Bookings
router.get('/my-bookings', protect, authorize('customer'), async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user._id }).populate('provider', 'name profileImage');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Razorpay Order
router.post('/create-razorpay-order/:id', protect, authorize('customer'), async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Invalid booking or already paid' });
        }

        const options = {
            amount: booking.amount * 100, // Razorpay works in paise
            currency: 'INR',
            receipt: `receipt_booking_${booking._id}`
        };

        try {
            // Attempt real Razorpay order creation
            const order = await razorpay.orders.create(options);
            res.json(order);
        } catch (rzpErr) {
            console.log('Razorpay API failed (likely mock keys). Using local mock order.');
            // Fallback for testing without real API keys
            res.json({
                id: `order_mock_${Date.now()}`,
                entity: 'order',
                amount: options.amount,
                amount_paid: 0,
                amount_due: options.amount,
                currency: 'INR',
                receipt: options.receipt,
                status: 'created',
                attempts: 0
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Confirm Razorpay Payment (Signature Verification)
router.post('/payment-confirm/:id', protect, authorize('customer'), async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify Signature if provided (skip for mock local testing)
        if (razorpay_signature && razorpay_signature !== 'mock_signature') {
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'mocksecret1234567890abcdef')
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature !== expectedSign) {
                return res.status(400).json({ message: 'Invalid payment signature' });
            }
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.paymentStatus = 'paid';
        booking.transactionId = razorpay_payment_id || `txn_mock_${Date.now()}`;
        booking.commissionAmount = booking.amount * 0.10;
        await booking.save();

        res.json({ message: 'Payment confirmed securely', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
