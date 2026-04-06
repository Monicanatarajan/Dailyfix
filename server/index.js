const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const Message = require('./models/Message');

dotenv.config();

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
].filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true
}));
app.use(cookieParser());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const PORT      = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dailyfix';

// Log which DB we are connecting to (masks password for safety)
const safeURI = MONGO_URI.replace(/:([^@]+)@/, ':<password>@');
console.log(`[DB] Connecting to: ${safeURI}`);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/provider', require('./routes/provider'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/public', require('./routes/public'));

app.get('/', (req, res) => {
    res.send('Daily Fix API is running...');
});

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);

    // Join a booking-specific room (e.g., room name = bookingId)
    socket.on('joinBookingRoom', (bookingId) => {
        socket.join(`booking_${bookingId}`);
        console.log(`Socket ${socket.id} joined booking room: booking_${bookingId}`);
    });

    // Also support personal room join (for backward compat / notifications)
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, bookingId, message } = data;

        try {
            const newMsg = new Message({ senderId, receiverId, bookingId: bookingId || null, message });
            await newMsg.save();

            if (bookingId) {
                // Booking room: emit to all participants in the booking room (customer + provider)
                io.to(`booking_${bookingId}`).emit('receiveMessage', newMsg);
            } else {
                // Direct chat: emit to receiver AND back to sender (for real-time update on sender side)
                io.to(receiverId).emit('receiveMessage', newMsg);
                io.to(senderId).emit('receiveMessage', newMsg);
            }
        } catch (error) {
            console.error('Socket message save error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from chat:', socket.id);
    });
});

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10s — enough for Atlas cold start on Render
})
    .then(() => {
        console.log('Successfully connected to MongoDB.');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('CRITICAL: MongoDB connection failed:', err.message);
        process.exit(1); // Force Render to restart the service
    });
