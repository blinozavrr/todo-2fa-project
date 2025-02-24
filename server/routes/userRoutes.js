const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { getProfile, updateProfile, getAllUsers, makeAdmin } = require('../controllers/userController');

// Только залогиненные
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Только админ
router.get('/', authMiddleware, roleMiddleware, getAllUsers);
router.put('/:userId', authMiddleware, roleMiddleware, makeAdmin);

module.exports = router;
