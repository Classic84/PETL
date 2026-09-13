require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiting for API Routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Database Connection
const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
mongoose.connect(dbUri)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.error('DB Connection Error:', err));

// API Route Definitions
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Fallback Route for Express 5 compatibility
// Any unmatched route will serve index.html (useful for handling 404s gracefully)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));