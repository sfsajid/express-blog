const router = require('express').Router();

const {
    getNewPost,
    postNewPost,
    getEditPost,
    postEditPost,
    getDeletePost,
    getPosts,
} = require('../controllers/postController');
const { postValidator } = require('../validators/postValidator');

const { isAuthenticated, hasProfile } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, hasProfile, getPosts);

router.get('/newpost', isAuthenticated, hasProfile, getNewPost);
router.post('/newpost', isAuthenticated, hasProfile, postValidator, postNewPost);

router.get('/editpost/:postUrl', isAuthenticated, getEditPost);
router.post('/editpost/:postUrl', isAuthenticated, hasProfile, postValidator, postEditPost);

router.get('/delete/:postUrl', isAuthenticated, hasProfile, getDeletePost);

module.exports = router;
