const { body } = require('express-validator');

const Post = require('../models/postModel');

const postValidator = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Please Enter Title')
        .isLength({ max: 100 })
        .withMessage('Title should be less than 100 characters')
        .trim(),

    body('body').not().isEmpty().withMessage('Please Enter Post'),

    body('tags').not().isEmpty().withMessage('Please Enter Tags').trim(),
    body('posturl')
        .not()
        .isEmpty()
        .withMessage('Please Enter Url')
        .isLength({ min: 5 })
        .withMessage('Url should be at least 5 characters')
        .custom(async (posturl) => {
            const post = await Post.findOne({ url: posturl });
            if (post) {
                if (post.url !== posturl) {
                    throw new Error('Url already exists');
                }
            }
            return true;
        })
        .trim(),
];

module.exports = { postValidator };
