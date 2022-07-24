const Post = require('../models/postModel');
const Profile = require('../models/profileModel');
const Flash = require('../utils/flash');

const getSearchResult = async (req, res, next) => {
    const { term } = req.query;
    const currentPage = req.query.page || 1;
    const itemPerPage = 10;

    try {
        const posts = await Post.find({
            $text: { $search: term },
        })
            .populate({
                path: 'author',
                select: 'username name profilePics',
            })
            .skip(itemPerPage * (currentPage - 1))
            .limit(itemPerPage);

        const totalPosts = await Post.countDocuments({
            $text: { $search: term },
        });
        const totalPages = Math.ceil(totalPosts / itemPerPage);

        let bookmarks = [];
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user._id });
            bookmarks = profile.bookmarks;
        }
        res.render('pages/search', {
            title: 'Explore',
            posts,
            flashMessage: Flash.getMessage(req),
            currentPage,
            searchTerm: term,
            totalPages,
            bookmarks,
            itemPerPage,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getSearchResult };
