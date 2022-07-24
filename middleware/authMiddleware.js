const User = require('../models/userModel');

const bindUserWithRequest = () => async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return next();
    }

    try {
        const user = await User.findById(req.session.user._id);
        req.user = user;
    } catch (error) {
        console.log(error);
        next(error);
    }
    return next();
};

const isVerified = (req, res, next) => {
    if (req.user.verified) {
        return res.redirect('/dashboard');
    }
    return next();
};

const isUser = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    return next();
};

const isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    if (!req.user.verified) {
        return res.redirect('/auth/verify');
    }
    return next();
};

const isUnauthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }
    return next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.redirect('/dashboard');
    }

    return next();
};

const hasProfile = (req, res, next) => {
    if (!req.user.profile) {
        return res.redirect('/dashboard/create-profile');
    }
    return next();
};

module.exports = {
    bindUserWithRequest,
    isAuthenticated,
    isUnauthenticated,
    isAdmin,
    hasProfile,
    isUser,
    isVerified,
};
