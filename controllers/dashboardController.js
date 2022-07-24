const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');

const Flash = require('../utils/flash');
const Profile = require('../models/profileModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

const getDashboard = async (req, res, next) => {
    try {
        const likes = await Post.find({ likes: req.user._id }).sort({ createdAt: -1 }).limit(3);

        const comments = await Comment.find({ author: req.user._id })
            .populate({
                path: 'post',
                select: 'author title thumbnail url',
                populate: {
                    path: 'author',
                    select: 'name username',
                },
            })
            .sort({ createdAt: -1 })
            .limit(5);

        const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 }).limit(3);

        const profile = await Profile.findOne({ user: req.user._id });

        res.render('pages/dashboard/dashboard', {
            title: 'My Dashboard',
            flashMessage: Flash.getMessage(req),
            active: {
                dashboard: true,
            },
            likes,
            comments,
            profile,
            posts,
        });
    } catch (error) {
        next(error);
    }
};

const getCreateProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        if (profile) {
            res.redirect('/dashboard/edit-profile');
        } else {
            res.render('pages/dashboard/create-profile', {
                title: 'Create Your Profile',
                flashMessage: Flash.getMessage(req),
                error: {},
                active: {
                    account: true,
                    createProfile: true,
                },
                values: {},
            });
        }
    } catch (error) {
        next(error);
    }
};

const postCreateProfile = async (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    if (!errors.isEmpty()) {
        res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            active: {
                account: true,
                createProfile: true,
            },
            values: req.body,
        });
    } else {
        const { name, nickname, bio, website, facebook, twitter, github } = req.body;

        try {
            const profile = new Profile({
                user: req.user._id,
                name,
                nickname,
                bio,
                profilePic: req.user.profilePics,
                links: {
                    website,
                    facebook,
                    twitter,
                    github,
                },
                posts: [],
                bookmarks: [],
            });

            const createdProfile = await profile.save();
            await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        profile: createdProfile._id,
                        name,
                    },
                }
            );
            if (createdProfile) {
                res.redirect('/dashboard');
            }
        } catch (error) {
            next(error);
        }
    }
};

const getEditProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        if (profile) {
            res.render('pages/dashboard/edit-profile', {
                title: 'Edit Your Profile',
                flashMessage: Flash.getMessage(req),
                profile,
                error: {},
                active: {
                    account: true,
                    editProfile: true,
                },
            });
        } else {
            res.redirect('/dashboard/create-profile');
        }
    } catch (error) {
        next(error);
    }
};

const postEditProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            res.render('pages/dashboard/edit-profile', {
                title: 'Edit Your Profile',
                flashMessage: Flash.getMessage(req),
                profile: req.body,
                error: errors.mapped(),
                active: {
                    account: true,
                    editProfile: true,
                },
            });
        } else {
            const { name, nickname, bio, website, facebook, twitter, github } = req.body;

            const updatedProfile = await Profile.findOneAndUpdate(
                { user: req.user._id },
                {
                    $set: {
                        name,
                        nickname,
                        bio,
                        links: {
                            website,
                            facebook,
                            twitter,
                            github,
                        },
                    },
                },
                { new: true }
            );
            await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        name,
                    },
                },
                { new: true }
            );
            res.render('pages/dashboard/edit-profile', {
                title: 'Edit Your Profile',
                flashMessage: Flash.getMessage(req),
                profile: updatedProfile,
                error: {},
                active: {
                    account: true,
                    editProfile: true,
                },
            });
        }
    } catch (error) {
        next(error);
    }
};

const getBookmarks = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).populate({
            path: 'bookmarks',
            populate: {
                path: 'author',
                select: 'name username profilePics',
            },
        });
        res.render('pages/dashboard/bookmarks', {
            title: 'Bookmarks',
            flashMessage: Flash.getMessage(req),
            posts: profile.bookmarks,
            active: {
                bookmark: true,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getComments = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const comments = await Comment.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'post',
                select: 'title url author thumbnail',
                populate: {
                    path: 'author',
                    select: 'username name profilePics',
                },
            })
            .skip((currentPage - 1) * itemPerPage)
            .limit(itemPerPage);
        const totalPosts = await Comment.countDocuments();
        const totalPages = Math.ceil(totalPosts / itemPerPage);
        res.render('pages/dashboard/comments', {
            title: 'Comments',
            flashMessage: Flash.getMessage(req),
            comments,
            totalPages,
            currentPage,
            active: {
                comment: true,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getSettings = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        res.render('pages/dashboard/settings', {
            title: 'Settings',
            flashMessage: Flash.getMessage(req),
            profile,
            active: {
                account: true,
                settings: true,
            },
            error: {},
        });
    } catch (error) {
        next(error);
    }
};

const postChangePassword = async (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    const { password, newPassword } = req.body;

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/settings', {
            title: 'Settings',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const isValidPassword = await bcrypt.compare(password, req.user.password);

        if (!isValidPassword) {
            return res.render('pages/dashboard/settings', {
                title: 'Settings',
                error: {
                    password: 'Your password is incorrect',
                },
                flashMessage: Flash.getMessage(req),
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $set: {
                    password: hashedPassword,
                },
            },
            { new: true }
        );
        req.flash('success', 'Password changed successfully');
        return res.render('pages/dashboard/settings', {
            title: 'Settings',
            error: {},
            flashMessage: Flash.getMessage(req),
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDashboard,
    getCreateProfile,
    postCreateProfile,
    getEditProfile,
    postEditProfile,
    getBookmarks,
    getComments,
    getSettings,
    postChangePassword,
};
