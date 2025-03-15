const express = require('express');

const router = express.Router();

// Group all routes here
router.use('/auth', require('./authRoutes'));
router.use('/tasks', require('./taskRoutes'));

module.exports = router;
