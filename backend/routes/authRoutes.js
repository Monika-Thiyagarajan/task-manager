const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateAuth');

const router = express.Router();

// Public Routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

module.exports = router;
