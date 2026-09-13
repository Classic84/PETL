require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust Render's proxy so rate limiting and IP detection work correctly
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiting for API Routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ============================================================
// Database Connection
// ============================================================
const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!dbUri) {
    console.error('❌ FATAL: MONGO_URI (or MONGODB_URI) is not set on this environment!');
} else {
    // Print only the cluster host — never the password
    const hostPart = dbUri.split('@')[1]?.split('/')[0] || 'unknown';
    console.log('🔌 Connecting to DB host:', hostPart);

    mongoose.connect(dbUri)
        .then(() => console.log('✅ MongoDB Atlas Connected'))
        .catch(err => console.error('❌ DB Connection Error:', err.message));
}

// ============================================================
// Health Check Endpoint (for debugging)
// ============================================================
app.get('/api/health', (req, res) => {
    const stateMap = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        server: 'ok',
        env: {
            hasMongoUri: !!(process.env.MONGO_URI || process.env.MONGODB_URI),
            hasJwtSecret: !!process.env.JWT_SECRET,
            clientUrl: process.env.CLIENT_URL || null
        },
        db: {
            state: mongoose.connection.readyState,
            stateText: stateMap[mongoose.connection.readyState] || 'unknown',
            name: mongoose.connection.name || null,
            host: mongoose.connection.host || null
        }
    });
});

// ============================================================
// API Route Definitions
// ============================================================
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// ============================================================
// Fallback Route for Express 5 compatibility
// Any unmatched route serves index.html (graceful 404 handling)
// NOTE: must come AFTER all API routes (including /api/health)
// ============================================================
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));