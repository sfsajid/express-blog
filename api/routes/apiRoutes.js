const router = require('express').Router();

const { isAuthenticated } = require('../../middleware/authMiddleware');

const { postComment, postReply } = require('../controllers/commentController');

const { getLikes, getDislikes } = require('../controllers/likeDislikeController');

const { getBookmarks } = require('../controllers/bookmarkController');

const { checkUrl } = require('../controllers/linkController');

router.post('/comments/:postUrl', isAuthenticated, postComment);
router.post('/comments/replies/:commentId', isAuthenticated, postReply);

router.get('/likes/:postUrl', isAuthenticated, getLikes);
router.get('/dislikes/:postUrl', isAuthenticated, getDislikes);

router.get('/bookmarks/:postUrl', isAuthenticated, getBookmarks);

router.get('/checkurl', isAuthenticated, checkUrl);

module.exports = router;
