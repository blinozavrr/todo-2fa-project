const express = require('express');
const router = express.Router();
const { register, verify2FA, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-2fa', verify2FA);
router.post('/login', login);

module.exports = router;
