const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 1. Verify token with Firebase Admin
            // If admin is not initialized (dev mode without creds), we might want to bypass or mock?
            // For production quality, strict check is better.
            if (!admin.apps.length) {
                return res.status(503).json({ message: 'Firebase service unavailable' });
            }

            const decodedToken = await admin.auth().verifyIdToken(token);
            req.userUid = decodedToken.uid;
            req.userEmail = decodedToken.email;

            // 2. Find user in MongoDB
            if (req.userUid) {
                // We don't necessarily need to fetch the full mongo object EVERY time if we trust the token,
                // but usually we want to attach the Mongo ID and Role to the request.
                const user = await User.findOne({ firebaseUID: req.userUid }).select('-password');
                // Note: We don't store passwords, but good practice to exclude sensitive fields if we did.

                if (user) {
                    req.user = user;
                    next();
                } else {
                    // Optionally auto-create user here if strictly sync isn't required, 
                    // but better to fail and force a sync login call.
                    res.status(401).json({ message: 'User not found in database. Please login/sync.' });
                }
            } else {
                res.status(401).json({ message: 'Not authorized, token failed' });
            }

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminCheck };
