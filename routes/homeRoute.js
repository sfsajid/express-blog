const router = require('express').Router();

const { getHome, singlePost } = require('../controllers/exploreController');

router.get('/', getHome);

router.get('/:username/:postUrl', singlePost);

module.exports = router;
