const router = require('express').Router();

const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const { getUsers } = require('../controllers/adminController');

router.get('/users', isAuthenticated, isAdmin, getUsers);

module.exports = router;
