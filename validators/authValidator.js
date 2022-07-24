const { body } = require('express-validator');
const User = require('../models/userModel');

const signupValidator = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric')
        .isLength({ max: 15 })
        .withMessage('Username must be less than 15 characters')
        .custom(async (username) => {
            const user = await User.findOne({ username });
            if (user) {
                throw new Error('Username already exists');
            }
            return true;
        })
        .trim(),
    body('name')
        .not()
        .isEmpty()
        .withMessage('Please enter your name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .isStrongPassword()
        .withMessage('Password must be contain a number, a special character and a capital letter'),
    body('confirmPassword')
        .isLength({ min: 8 })
        .withMessage('Password must match')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
];

const signinValidator = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Please enter a valid password'),
];

const changePassValidator = [
    body('password').isLength({ min: 8 }).withMessage('Please enter a valid password'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .isStrongPassword()
        .withMessage('Password must be contain a number, a special character and a capital letter'),
    body('confirmPassword')
        .isLength({ min: 8 })
        .withMessage('Password must match')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.newPassword) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
];

const forgotPasswordValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Email not found');
            }
            return true;
        }),
];

const passwordResetValidator = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .isStrongPassword()
        .withMessage('Password must be contain a number, a special character and a capital letter'),
    body('confirmPassword')
        .isLength({ min: 8 })
        .withMessage('Password must match')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
];

module.exports = {
    signupValidator,
    signinValidator,
    changePassValidator,
    forgotPasswordValidator,
    passwordResetValidator,
};
