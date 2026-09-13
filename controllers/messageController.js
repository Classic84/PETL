const ContactMessage = require('../models/ContactMessage');

exports.submitMessage = async (req, res) => {
    try {
        const message = await ContactMessage.create(req.body);
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};