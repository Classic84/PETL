const express = require('express');
const { submitMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', submitMessage);
router.get('/', protect, getMessages);

module.exports = router;