const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }], // e.g., "CBT Exam Navigation", "Score Synchronization"
    techStack: [{ type: String }],
    imageUrl: { type: String },
    liveLink: { type: String },
    isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);