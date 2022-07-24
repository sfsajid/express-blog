const { body } = require('express-validator');
const validator = require('validator');

const linkValidator = (link) => {
    if (link.length > 0) {
        if (!validator.isURL(link)) {
            throw new Error('Please enter a valid link');
        }
    }
    return true;
};

const profileValidator = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Please provide your Full Name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters long')
        .trim(),

    body('nickname')
        .not()
        .isEmpty()
        .withMessage('Please provide your nickname')
        .isLength({ min: 3 })
        .withMessage('Nickname must be at least 3 characters long')
        .isLength({ max: 100 })
        .withMessage('Nickname must be less than 100 characters long')
        .trim(),

    body('bio')
        .not()
        .isEmpty()
        .withMessage('Please provide your bio')
        .isLength({ min: 3 })
        .withMessage('Bio must be at least 3 characters long')
        .isLength({ max: 500 })
        .withMessage('Bio must be less than 500 characters long')
        .trim(),

    body('website').custom(linkValidator),
    body('facebook').custom(linkValidator),
    body('twitter').custom(linkValidator),
    body('github').custom(linkValidator),
];

module.exports = { profileValidator };
