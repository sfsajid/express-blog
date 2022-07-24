const Profile = require('../../models/profileModel');
const Post = require('../../models/postModel');

const getBookmarks = async (req, res, next) => {
    const { postUrl } = req.params;
    let bookmark = null;
    if (!req.user) {
        return res.status(403).json({
            error: 'You must be logged in to bookmark',
        });
    }

    try {
        const profile = await Profile.findOne({ user: req.user._id });
        const post = await Post.findOne({ url: postUrl });
        if (profile.bookmarks.includes(post._id)) {
            await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { bookmarks: post._id } },
                { new: true }
            );
            bookmark = false;
        } else {
            await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $push: { bookmarks: post._id } },
                { new: true }
            );
            bookmark = true;
        }

        return res.status(200).json({
            bookmark,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Something went wrong',
        });
    }
};

module.exports = { getBookmarks };
