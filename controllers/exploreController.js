const Flash = require('../utils/flash');
const Post = require('../models/postModel');
const Profile = require('../models/profileModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

const getHome = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.page, 10) || 1;
        const itemPerPage = 10;
        const featuredPosts = await Post.find({}).sort({ views: -1 }).limit(3);
        const posts = await Post.find({})
            .populate({
                path: 'author',
                select: 'username name profilePics',
            })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * itemPerPage)
            .limit(itemPerPage);
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / itemPerPage);
        const logged = {
            bookmarks: [],
        };
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id });
            logged.bookmarks = profile ? profile.bookmarks : [];
        }
        res.render('pages/explore', {
            title: 'Explore',
            posts,
            flashMessage: Flash.getMessage(req),
            currentPage,
            totalPages,
            logged,
            itemPerPage,
            featuredPosts,
        });
    } catch (err) {
        next(err);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).populate({
            path: 'profile',
        });
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        const currentPage = parseInt(req.query.page, 10) || 1;
        const itemPerPage = 10;
        const posts = await Post.find({ author: user._id })
            .populate({
                path: 'author',
                select: 'username name profilePics',
            })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * itemPerPage)
            .limit(itemPerPage);
        const comments = await Comment.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'post',
                select: 'title url author thumbnail',
                populate: {
                    path: 'author',
                    select: 'username name profilePics',
                },
            })
            .limit(10);
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / itemPerPage);
        const logged = {
            bookmarks: [],
        };
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id });
            logged.bookmarks = profile ? profile.bookmarks : [];
        }
        res.render('pages/user', {
            title: `${user.name}'s Profile`,
            user,
            posts,
            flashMessage: Flash.getMessage(req),
            currentPage,
            totalPages,
            comments,
            logged,
            itemPerPage,
        });
    } catch (err) {
        next(err);
    }
};

const singlePost = async (req, res, next) => {
    const { postUrl, username } = req.params;
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }

        const post = await Post.findOne({ url: postUrl })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'profilePics username name',
                },
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies.user',
                    select: 'name username profilePics',
                },
            });
        if (!post) {
            const error = new Error('404 - Page not found');
            error.status = 404;
            throw error;
        }
        const author = await Profile.findOne({ user: post.author }).populate('user');
        const liked = {
            liked: false,
            disliked: false,
        };
        if (req.user) {
            liked.liked = post.likes.includes(req.user._id);
            liked.disliked = post.dislikes.includes(req.user._id);
        }
        post.fullUrl = fullUrl;
        await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
        res.render('pages/single-post', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            author,
            liked,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getHome,
    getUser,
    singlePost,
};
