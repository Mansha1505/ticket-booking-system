const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Sync Firebase User with MongoDB
// @route   POST /api/auth/sync
// @access  Public (Token required in body or header intended conceptually, but endpoint verifies token)
// Actually better to make this protected slightly, effectively "Exchange Token for User Profile"
// We will assume the client sends the token in the header, caught by middleware, but WAIT.
// If the user doesn't exist in MongoDB, `protect` middleware might fail.
// So we need a special "login/sync" endpoint that does the validation manually OR handles the "User Not Found" case gracefully.
// Let's make a manual verification here for the first login.

const admin = require('../config/firebase');

router.post('/sync', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        if (!admin.apps.length) throw new Error("Firebase Admin not initialized");

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        // Check if user exists
        let user = await User.findOne({ firebaseUID: uid });

        if (user) {
            // Update info if needed? or just return
            res.json(user);
        } else {
            // Create new user
            user = await User.create({
                name: name || email.split('@')[0], // Fallback name
                email: email,
                firebaseUID: uid,
                role: 'user' // Default role
            });
            res.status(201).json(user);
        }

    } catch (error) {
        console.error("Auth Sync Error:", error);
        res.status(401).json({ message: 'Invalid token or server error' });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
