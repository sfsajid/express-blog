const router = require('express').Router();

const { getUser } = require('../controllers/exploreController');

router.get('/:username', getUser);

module.exports = router;
