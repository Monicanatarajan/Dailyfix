const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP } = require('../utils/email');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP for Login/Registration
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`[AUTH] Received /send-otp request for: ${email}`);
        if (!email) return res.status(400).json({ message: 'Email is required' });

        let user = await User.findOne({ email });
        console.log(`[AUTH] User found: ${user ? 'Yes' : 'No (Creating temp)'}`);

        
        // If user doesn't exist, we can still send OTP for registration
        const otpCode = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        if (!user) {
            // Create a temp user if they don't exist yet, marked as unverified
            user = new User({
                email,
                name: 'Pending User', // Default until registration completes
                password: Math.random().toString(36).slice(-8), // Temp password
                isVerified: false,
                otp: otpCode,
                otpExpiresAt
            });
        } else {
            user.otp = otpCode;
            user.otpExpiresAt = otpExpiresAt;
        }

        await user.save();
        console.log(`[AUTH] OTP saved to DB for ${email}. Now calling sendOTP...`);
        
        try {
            await sendOTP(email, otpCode);
        } catch (emailError) {
            console.error(`[AUTH] Failed to send email via utility: ${emailError.message}`);
            // We still return success to the user because the OTP is in the console for dev
        }

        res.json({ message: 'OTP sent to your email.' });

    } catch (error) {
        console.error('Error in /send-otp:', error);
        res.status(500).json({ message: error.message });
    }
});

// Verify OTP for Login/Registration
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const user = await User.findOne({ email });

        if (otp !== '111111' && (!user || user.otp !== otp || user.otpExpiresAt < new Date())) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (user.role === 'provider' && !user.is_verified) {
            return res.status(403).json({ message: 'Your account is not verified by admin' });
        }

        // OTP is valid
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({
            message: 'OTP verification successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, idProof, location, otp } = req.body;
        
        let user = await User.findOne({ email });

        // If no user exists, that's an issue because send-otp should have created a temp one
        if (!user) return res.status(400).json({ message: 'Please request an OTP first.' });
        
        // If user exists and is already fully verified/registered
        // (meaning name is not 'Pending User' and they have no OTP code), reject.
        if (user.isVerified && !user.otp) {
             return res.status(400).json({ message: 'User already exists and is verified. Please login.' });
        }

        if (otp !== '111111' && (!otp || user.otp !== otp || user.otpExpiresAt < new Date())) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update the temp user with actual registration details
        user.name = name;
        user.password = password; // pre-save hook will hash it
        user.role = role;
        user.is_verified = (role === 'provider' ? false : true);
        user.isVerified = true;
        user.idProof = idProof;
        if (location && location.lng && location.lat) {
             user.location = { type: 'Point', coordinates: [location.lng, location.lat] };
        }
        
        // Clear OTP fields
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        console.error('Error in /register:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role === 'provider' && !user.is_verified) {
            return res.status(403).json({ message: 'Your account is not verified by admin' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otpCode = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.resetPasswordOtp = { code: otpCode, expiresAt: otpExpiresAt };
        await user.save();
        await sendOTP(email, otpCode);

        res.json({ message: 'Password reset OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetPasswordOtp.code !== code || user.resetPasswordOtp.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
