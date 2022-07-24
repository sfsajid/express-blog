const { validationResult } = require('express-validator');
const readingTime = require('reading-time');

const Flash = require('../utils/flash');

const Post = require('../models/postModel');
const Profile = require('../models/profileModel');
const Comment = require('../models/commentModel');

const getNewPost = (req, res, next) => {
    res.render('pages/dashboard/posts/newpost', {
        title: 'Create a new post',
        error: {},
        flashMessage: Flash.getMessage(req),
        values: {},
        active: {
            post: true,
            newPost: true,
        },
    });
};

const postNewPost = async (req, res, next) => {
    const { title, body, thumbnail } = req.body;

    let { tags, posturl } = req.body;
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    if (!errors.isEmpty()) {
        res.render('pages/dashboard/posts/newpost', {
            title: 'Create a new post',
            error: errors.mapped(),
            active: {
                post: true,
                newPost: true,
            },
            flashMessage: Flash.getMessage(req),
            values: { title, body, tags, posturl, thumbnail },
        });
    } else {
        tags = tags.split(',').map((tag) => tag.trim());
        posturl = posturl
            .toLowerCase()
            .replace(/[^a-z\d\s\\-]|^\W+|\W+$/gi, '')
            .split(' ')
            .join('-');
        const readTime = readingTime(body);

        const post = new Post({
            title,
            body,
            tags,
            author: req.user._id,
            readTime: readTime.minutes,
            likes: [],
            dislikes: [],
            comments: [],
            thumbnail,
            url: posturl,
        });

        try {
            const newPost = await post.save();
            await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $push: { posts: newPost._id } }
            );
            res.redirect(`/posts/editpost/${newPost.url}`);
        } catch (err) {
            next(err);
        }
    }
};

const getEditPost = async (req, res, next) => {
    const { postUrl } = req.params;
    try {
        const post = await Post.findOne({ url: postUrl });
        let isPostAuthor = false;
        if (post) {
            isPostAuthor =
                post.author.toString() === req.user._id.toString() || req.user.role === 'admin';
        }

        if (!post || !isPostAuthor) {
            const error = new Error('404 - Page not found');
            error.status = 404;
            throw error;
        }

        res.render('pages/dashboard/posts/editpost', {
            title: 'Edit post',
            error: {},
            active: {
                post: true,
                editPost: true,
            },
            flashMessage: Flash.getMessage(req),
            values: {
                title: post.title,
                body: post.body,
                tags: post.tags.join(', '),
                thumbnail: post.thumbnail,
                id: post._id,
                posturl: post.url,
            },
        });
    } catch (err) {
        next(err);
    }
};

const postEditPost = async (req, res, next) => {
    try {
        const { postUrl } = req.params;
        const post = await Post.findOne({ url: postUrl });
        let isPostAuthor = false;
        if (post) {
            isPostAuthor =
                post.author.toString() === req.user._id.toString() || req.user.role === 'admin';
        }
        if (!post || !isPostAuthor) {
            const error = new Error('404 - Page not found');
            error.status = 404;
            throw error;
        }
        const { title, body, tags, thumbnail, posturl } = req.body;
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            res.render('pages/dashboard/posts/editpost', {
                title: 'Edit post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                active: {
                    post: true,
                    editPost: true,
                },
                values: {
                    title: post.title,
                    body: post.body,
                    tags: post.tags.join(', '),
                    thumbnail: post.thumbnail,
                    id: post._id,
                    posturl,
                },
            });
        }
        const readTime = readingTime(body);

        const newPost = {
            title,
            body,
            tags: tags.split(',').map((tag) => tag.trim()),
            readTime: readTime.minutes,
            thumbnail,
            url: posturl
                .toLowerCase()
                .replace(/[^a-z\d\s\\-]|^\W+|\W+$/gi, '')
                .split(' ')
                .join('-'),
        };

        await Post.findOneAndUpdate({ _id: post._id }, { $set: newPost }, { new: true });
        res.redirect(`/posts/`);
    } catch (err) {
        next(err);
    }
};

const getDeletePost = async (req, res, next) => {
    const { postUrl } = req.params;
    try {
        const post = await Post.findOne({ url: postUrl });
        const isPostAuthor =
            post.author.toString() === req.user._id.toString() || req.user.role === 'admin';
        if (!post || !isPostAuthor) {
            const error = new Error('404 - Page not found');
            error.status = 404;
            throw error;
        }
        await Post.findOneAndDelete({ url: postUrl });
        await Comment.deleteMany({ post: post._id });
        await Profile.findOneAndUpdate({ user: req.user._id }, { $pull: { posts: post._id } });
        req.flash('success', 'Post deleted successfully');
        res.redirect('/posts');
    } catch (err) {
        next(err);
    }
};

const getPosts = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const posts = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username name',
            })
            .skip((currentPage - 1) * itemPerPage)
            .limit(itemPerPage);
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / itemPerPage);
        res.render('pages/dashboard/posts/posts', {
            title: 'My Posts',
            error: {},
            active: {
                post: true,
                myPosts: true,
            },
            flashMessage: Flash.getMessage(req),
            posts,
            totalPages,
            currentPage,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getNewPost,
    postNewPost,
    getEditPost,
    postEditPost,
    getDeletePost,
    getPosts,
};
