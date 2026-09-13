const express = require('express');
const { getProjects, createProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', getProjects);
router.post('/', protect, createProject);

module.exports = router;