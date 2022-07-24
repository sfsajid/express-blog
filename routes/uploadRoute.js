const router = require('express').Router();

const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const image = require('../middleware/imageMiddleware');

const {
    uploadProfilePicture,
    removeProfilePicture,
    postImage,
    getImage,
} = require('../controllers/uploadController');

router.post('/profilePics', isAuthenticated, upload.single('profilePics'), uploadProfilePicture);

router.delete('/profilePics', isAuthenticated, removeProfilePicture);

router.post('/postimage', isAuthenticated, upload.single('postimage'), image, postImage);

router.post('/thumbnail', isAuthenticated, upload.single('post-thumbnail'), image, postImage);

router.get('/getimage', isAuthenticated, getImage);

module.exports = router;
