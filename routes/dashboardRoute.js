const router = require('express').Router();
const { isAuthenticated, hasProfile } = require('../middleware/authMiddleware');
const {
    getDashboard,
    getCreateProfile,
    getEditProfile,
    postCreateProfile,
    postEditProfile,
    getBookmarks,
    getComments,
    getSettings,
    postChangePassword,
} = require('../controllers/dashboardController');

const { profileValidator } = require('../validators/dashboardValidator');

const { changePassValidator } = require('../validators/authValidator');

router.get('/', isAuthenticated, hasProfile, getDashboard);

router.get('/bookmarks', isAuthenticated, hasProfile, getBookmarks);

router.get('/comments', isAuthenticated, hasProfile, getComments);

router.get('/settings', isAuthenticated, hasProfile, getSettings);
router.post('/settings/changepassword', isAuthenticated, changePassValidator, postChangePassword);

router.get('/create-profile', isAuthenticated, getCreateProfile);
router.post('/create-profile', isAuthenticated, profileValidator, postCreateProfile);

router.get('/edit-profile', isAuthenticated, getEditProfile);
router.post('/edit-profile', isAuthenticated, profileValidator, postEditProfile);

module.exports = router;
