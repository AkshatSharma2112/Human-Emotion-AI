// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Temporary user storage (in production, use database)
const users = [];

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'emotion-ai-secret-key-2026';

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save user
        const user = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString()
        };
        users.push(user);
        
        res.json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Verify token route
router.post('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token is required'
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            success: true,
            data: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
});

// Logout route (client-side will remove token)
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
