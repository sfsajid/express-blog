const router = require('express').Router();

const { getSearchResult } = require('../controllers/searchController');

router.get('/', getSearchResult);

module.exports = router;
