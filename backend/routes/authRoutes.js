// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // The JWT Engine
const User = require('../models/User'); // The User Blueprint

const router = express.Router();

// ==========================================
// CREATE: Register a new user
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validation: Did they leave anything blank?
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        // 2. Check for Duplicates: Is this email already in the database?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        // 3. The Security Vault: Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save to MongoDB Cloud
        const newUser = new User({
            username,
            email,
            password: hashedPassword // NEVER save the plain text password!
        });

        const savedUser = await newUser.save();

        // 5. Success! Send back the user data (but hide the password)
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// ==========================================
// READ: Login a user
// ==========================================
// ==========================================
// READ: Login a user (Dual-Token Flow)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // 2. Compare the password with the scrambled hash in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // 3a. Create the ACCESS TOKEN (Short-lived, e.g., 15 minutes)
        // Sent to React in the JSON body for memory storage
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // 3b. Create the REFRESH TOKEN (Long-lived, e.g., 7 days)
        // Sent to the browser in a secure, invisible cookie
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 4. Send the Refresh Token in the httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // JavaScript cannot read this

            // 👇 Requires HTTPS in production
            secure: process.env.NODE_ENV === 'production',

            // 👇 'none' allows cross-domain cookies in production. 
            // 'lax' keeps local development working.
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',

            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        // 5. Send back the Access Token and user data in the JSON body
        res.status(200).json({
            message: "Login successful!",
            accessToken: accessToken, // React will save this to state/context
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });


    } catch (error) {
        console.log("errorrorororr", error)
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;

module.exports = router;

