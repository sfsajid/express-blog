const Post = require('../../models/postModel');

const getLikes = async (req, res, next) => {
    const { postUrl } = req.params;
    let liked = null;
    try {
        if (!req.user) {
            return res.status(403).json({
                error: 'You must be logged in to like',
            });
        }
        const userId = req.user._id;
        const post = await Post.findOne({ url: postUrl });
        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: post._id },
                { $pull: { dislikes: userId } },
                { new: true }
            );
        }

        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: post._id },
                { $pull: { likes: userId } },
                { new: true }
            );
            liked = false;
        } else {
            await Post.findOneAndUpdate(
                { _id: post._id },
                { $push: { likes: userId } },
                { new: true }
            );
            liked = true;
        }

        const updatedPost = await Post.findOne({ _id: post._id });
        return res.status(200).json({
            liked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislikes.length,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Something went wrong',
        });
    }
};

const getDislikes = async (req, res, next) => {
    const { postUrl } = req.params;
    let disliked = null;
    try {
        if (!req.user) {
            return res.status(403).json({
                error: 'You must be logged in to like',
            });
        }
        const userId = req.user._id;
        const post = await Post.findOne({ url: postUrl });
        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: post._id },
                { $pull: { likes: userId } },
                { new: true }
            );
        }
        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: post._id },
                { $pull: { dislikes: userId } },
                { new: true }
            );
            disliked = false;
        } else {
            await Post.findOneAndUpdate(
                { _id: post._id },
                { $push: { dislikes: userId } },
                { new: true }
            );
            disliked = true;
        }

        const updatedPost = await Post.findOne({ _id: post._id });
        return res.status(200).json({
            disliked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislikes.length,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Something went wrong',
        });
    }
};

module.exports = { getLikes, getDislikes };
