const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    service: {
        type: String,
        required: true,
        enum: ['School Portal', 'Company Website', 'Custom Web Application', 'Business Management System', 'Mobile Application', 'Backend/API Development', 'Forex Mentorship', 'Other']
    },
    budget: { type: String },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ['Unread', 'Read', 'Archived'], default: 'Unread' }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', messageSchema);