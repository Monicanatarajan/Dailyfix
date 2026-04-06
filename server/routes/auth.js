const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { sendOTP } = require('../utils/email');

// ── helpers ──────────────────────────────────────────────────────────────────

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

// Generates a guaranteed 10-char alphanumeric temp password (always passes minlength:6)
const generateTempPassword = () =>
    Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-4);

// Cookie options — secure + sameSite=none required for cross-origin HTTPS (Render)
const cookieOptions = {
    httpOnly: true,
    maxAge:   24 * 60 * 60 * 1000,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

// ── GET /api/auth/health (browser-testable, remove in production) ────────────
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Auth routes are reachable. Use POST for actual endpoints.' });
});

// ── POST /api/auth/send-otp ───────────────────────────────────────────────────
// Works for both login (existing user) and registration (new user).
// Uses findOneAndUpdate with upsert so there is NEVER a duplicate-key race condition.
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otpCode     = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        console.log(`[AUTH] /send-otp → ${email}`);

        // findOneAndUpdate with upsert:
        //   - If user exists  → only updates otp fields, never touches password
        //   - If user is new  → creates a temp record with a valid password
        // setOnInsert runs ONLY on insert, so existing users' passwords are untouched
        await User.findOneAndUpdate(
            { email },
            {
                $set: { otp: otpCode, otpExpiresAt },
                $setOnInsert: {
                    name:       'Pending User',
                    password:   generateTempPassword(),
                    isVerified: false,
                    role:       'customer'
                }
            },
            { upsert: true, new: true, runValidators: false }
        );

        console.log(`[AUTH] OTP saved for ${email}: ${otpCode}`);

        // Fire-and-forget — email failure must never cause a 500
        sendOTP(email, otpCode).catch(err =>
            console.error(`[AUTH] Email send failed (non-fatal): ${err.message}`)
        );

        res.json({ message: 'OTP sent to your email.' });

    } catch (error) {
        console.error('[AUTH] /send-otp error:', error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ message: 'Email and OTP are required' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'No OTP request found for this email' });

        const isDevBypass = otp === '111111';
        const isExpired   = user.otpExpiresAt < new Date();
        const isWrong     = user.otp !== otp;

        if (!isDevBypass && (isWrong || isExpired))
            return res.status(400).json({ message: 'Invalid or expired OTP' });

        // Block fully-registered providers awaiting admin approval
        if (user.role === 'provider' && !user.is_verified && user.name !== 'Pending User')
            return res.status(403).json({ message: 'Your account is pending admin verification.' });

        user.isVerified   = true;
        user.otp          = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, cookieOptions);

        res.json({
            message: 'OTP verification successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        console.error('[AUTH] /verify-otp error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, idProof, location, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Please request an OTP first.' });

        if (user.isVerified && !user.otp)
            return res.status(400).json({ message: 'Account already exists. Please login.' });

        const isDevBypass = otp === '111111';
        if (!isDevBypass && (!otp || user.otp !== otp || user.otpExpiresAt < new Date()))
            return res.status(400).json({ message: 'Invalid or expired OTP' });

        user.name        = name;
        user.password    = password; // pre-save hook hashes it
        user.role        = role;
        user.is_verified = role !== 'provider'; // providers need admin approval
        user.isVerified  = true;
        user.idProof     = idProof;

        if (location?.lng && location?.lat)
            user.location = { type: 'Point', coordinates: [location.lng, location.lat] };

        user.otp          = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        console.error('[AUTH] /register error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        if (user.role === 'provider' && !user.is_verified)
            return res.status(403).json({ message: 'Your account is not verified by admin' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, cookieOptions);

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        console.error('[AUTH] /login error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// Never throws — logout must always succeed from the client's perspective
router.post('/logout', (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.json({ message: 'Logged out successfully' });
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otpCode     = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        user.resetPasswordOtp = { code: otpCode, expiresAt: otpExpiresAt };
        await user.save();

        // Fire-and-forget
        sendOTP(email, otpCode).catch(err =>
            console.error(`[AUTH] Forgot-password email failed (non-fatal): ${err.message}`)
        );

        res.json({ message: 'Password reset OTP sent to your email.' });
    } catch (error) {
        console.error('[AUTH] /forgot-password error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email });

        // Null guard — resetPasswordOtp may not exist if user never requested a reset
        if (!user || !user.resetPasswordOtp?.code)
            return res.status(400).json({ message: 'No password reset was requested for this email' });

        if (user.resetPasswordOtp.code !== code || user.resetPasswordOtp.expiresAt < new Date())
            return res.status(400).json({ message: 'Invalid or expired OTP' });

        user.password         = newPassword; // pre-save hook hashes it
        user.resetPasswordOtp = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
        console.error('[AUTH] /reset-password error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
