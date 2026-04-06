const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');

// Get chat history for a specific booking
router.get('/booking/:bookingId', protect, async (req, res) => {
    try {
        const messages = await Message.find({ bookingId: req.params.bookingId })
            .sort({ createdAt: 1 })
            .populate('senderId', 'name profileImage role');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching booking messages', error: err.message });
    }
});

// Get chat history between logged-in user and a specific provider (legacy)
router.get('/:providerId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const providerId = req.params.providerId;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: providerId },
                { senderId: providerId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 })
          .populate('senderId', 'name profileImage')
          .populate('receiverId', 'name profileImage');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching messages', error: err.message });
    }
});

// Get list of unique conversations (users the current user has chatted with)
router.get('/conversations/list', protect, async (req, res) => {
    try {
        const userId = new (require('mongoose').Types.ObjectId)(req.user.id);
        
        // Find unique users who have exchanged messages with current user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderId: userId }, { receiverId: userId }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", userId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$message" },
                    lastTimestamp: { $first: "$createdAt" },
                    unread: { 
                        $sum: { 
                            $cond: [
                                { $and: [
                                    { $eq: ["$receiverId", userId] },
                                    { $eq: ["$read", false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    lastTimestamp: 1,
                    unread: 1,
                    name: '$userInfo.name',
                    email: '$userInfo.email',
                    profileImage: {
                        $cond: {
                            if: { $regexMatch: { input: { $ifNull: ['$userInfo.profileImage', ''] }, regex: '^/uploads' } },
                            then: { $concat: ['http://localhost:5001', '$userInfo.profileImage'] },
                            else: { $ifNull: ['$userInfo.profileImage', 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'] }
                        }
                    }
                }
            }
        ]);

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching conversations', error: err.message });
    }
});

module.exports = router;
