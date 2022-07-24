const bcrypt = require('bcrypt');
const ejs = require('ejs');
const crypto = require('crypto');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Flash = require('../utils/flash');
const sendEmail = require('../utils/sendEmail');

const User = require('../models/userModel');
const Token = require('../models/tokenModel');

const getSignUp = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Create a new account',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

const postSignUp = async (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    const { username, name, email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.render('pages/auth/signup', {
            title: 'Create a new account',
            error: errors.mapped(),
            value: { username, email, name },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await new User({
            username,
            name,
            email,
            password: hashedPassword,
        }).save();
        const token = new Token({
            user: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        });
        await token.save();
        const fullUrl = `${req.protocol}://${req.get('host')}/auth/verify/${user._id}/${
            token.token
        }`;

        // TODO: send email with token

        const htmlFile = fs.readFileSync('utils/html/email.ejs', 'utf-8');
        const html = ejs.render(htmlFile, {
            name: user.name.split(' ')[0],
            url: fullUrl,
        });
        await sendEmail(user.email, `Verify Your Email - ${process.env.NAME}`, html);
        return res.redirect('/auth/verify');
    } catch (err) {
        return next(err);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token, userId } = req.params;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        const tokenFound = await Token.findOne({ user: userId, token });

        if (!tokenFound) {
            const error = new Error('Token not found');
            error.status = 404;
            throw error;
        }
        await User.findOneAndUpdate({ _id: userId }, { $set: { verified: true } });
        await Token.findOneAndDelete({ user: userId, token });
        res.render('pages/auth/verified', {
            title: 'Account Verified',
            flashMessage: Flash.getMessage(req),
        });
    } catch (error) {
        next(error);
    }
};

const getSignIn = (req, res, next) => {
    res.render('pages/auth/login', {
        title: 'Log in to Your Account',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

const postSignIn = async (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your credentials');
        return res.render('pages/auth/login', {
            title: 'Log into your account',
            error: errors.mapped(),
            value: { email },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const error = {
            email: ' ',
            password: ' ',
        };
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('fail', 'Invalid email or password');
            return res.render('pages/auth/login', {
                title: 'Log into your account',
                error,
                value: { email },
                flashMessage: Flash.getMessage(req),
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            req.flash('fail', 'Invalid email or password');
            return res.render('pages/auth/login', {
                title: 'Log into your account',
                error,
                value: { email },
                flashMessage: Flash.getMessage(req),
            });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'You are logged in');
            return res.redirect('/dashboard');
        });
    } catch (error) {
        next(error);
    }
    return true;
};

const signOut = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/auth/login');
    });
};

const getForgotPassword = (req, res, next) => {
    res.render('pages/auth/recover', {
        title: 'Forgot Password',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

const postForgotPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        const { email } = req.body;
        if (!errors.isEmpty()) {
            return res.render('pages/auth/recover', {
                title: 'Forgot Password',
                error: errors.mapped(),
                value: { email },
                flashMessage: Flash.getMessage(req),
            });
        }
        const user = await User.findOne({ email });

        if (!user.verified) {
            return res.render('pages/auth/recover', {
                title: 'Forgot Password',
                error: { email: 'Email is not verified' },
                value: { email },
                flashMessage: Flash.getMessage(req),
            });
        }
        const oldToken = await Token.findOne({ user: user._id });
        if (oldToken) {
            await Token.findOneAndDelete({ user: user._id });
        }
        const token = new Token({
            user: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        });
        await token.save();
        const fullUrl = `${req.protocol}://${req.get('host')}/auth/recover/${user._id}/${
            token.token
        }`;
        const htmlFile = fs.readFileSync('utils/html/reset.ejs', 'utf-8');
        const html = ejs.render(htmlFile, {
            name: user.name.split(' ')[0],
            url: fullUrl,
        });
        await sendEmail(user.email, `Reset Password - ${process.env.NAME}`, html);
        req.flash('success', 'Password reset link has been sent to your email');
        return res.redirect('/auth/recover');
    } catch (error) {
        return next(error);
    }
};

const getResetPassword = async (req, res, next) => {
    try {
        const { token, userId } = req.params;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        const tokenFound = await Token.findOne({ user: userId, token });
        if (!tokenFound) {
            const error = new Error('Token not found');
            error.status = 404;
            throw error;
        }
        res.render('pages/auth/reset', {
            title: 'Reset Password',
            error: {},
            value: {},
            token,
            userId,
            flashMessage: Flash.getMessage(req),
        });
        await Token.findOneAndDelete({ user: userId, token });
    } catch (error) {
        next(error);
    }
};

const postResetPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        const { token, userId } = req.params;

        const { password } = req.body;
        if (!errors.isEmpty()) {
            return res.render('pages/auth/reset', {
                title: 'Reset Password',
                error: errors.mapped(),
                value: {},
                token,
                userId,
                flashMessage: Flash.getMessage(req),
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: { password: hashedPassword } }
        );
        req.flash('success', 'Password has been reset');
        return res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
};

const getVerifyEmail = async (req, res, next) => {
    try {
        const token = await Token.findOne({ email: req.user.email });
        if (!token) {
            return res.render('pages/auth/verify', {
                title: 'Verify Your Email',
                flashMessage: Flash.getMessage(req),
                token: false,
            });
        }
        return res.render('pages/auth/verify', {
            title: 'Verify Your Email',
            flashMessage: Flash.getMessage(req),
            token: true,
        });
    } catch (error) {
        next(error);
    }
};

const postVerifyEmail = async (req, res, next) => {
    try {
        const token = await Token.findOne({ user: req.user._id });
        if (token) {
            return res.render('pages/auth/verify', {
                title: 'Verify Your Email',
                flashMessage: Flash.getMessage(req),
                token: true,
            });
        }
        const nToken = new Token({
            user: req.user._id,
            token: crypto.randomBytes(32).toString('hex'),
        });
        await nToken.save();
        const fullUrl = `${req.protocol}://${req.get('host')}/auth/verify/${req.user._id}/${
            nToken.token
        }`;

        // TODO: send email with token

        const htmlFile = fs.readFileSync('utils/html/email.ejs', 'utf-8');
        const html = ejs.render(htmlFile, {
            name: req.user.name.split(' ')[0],
            url: fullUrl,
        });
        await sendEmail(req.user.email, `Verify Your Email - ${process.env.NAME}`, html);
        return res.redirect('/auth/verify');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSignUp,
    postSignUp,
    getSignIn,
    postSignIn,
    signOut,
    verifyEmail,
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword,
    getVerifyEmail,
    postVerifyEmail,
};
