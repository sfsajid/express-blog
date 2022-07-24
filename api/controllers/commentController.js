const moment = require('moment');

const Post = require('../../models/postModel');
const Comment = require('../../models/commentModel');

const postComment = async (req, res, next) => {
    const { postUrl } = req.params;
    const { body } = req.body;
    try {
        const post = await Post.findOne({ url: postUrl });
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
            });
        }
        if (!req.user) {
            return res.status(403).json({
                error: 'You must be logged in to comment',
            });
        }
        const comment = new Comment({
            post: post._id,
            user: req.user._id,
            body,
            replies: [],
        });

        const createdComment = await comment.save();
        await Post.findOneAndUpdate(
            { _id: post._id },
            { $push: { comments: createdComment._id } },
            { new: true }
        );

        let time = moment(createdComment.createdAt).fromNow();
        time = time.charAt(0).toUpperCase() + time.slice(1);

        const commentJSON = await Comment.findOne({ _id: createdComment._id }).populate({
            path: 'user',
            select: 'name profilePics',
        });
        commentJSON.moment = time;
        return res.status(201).json(commentJSON);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Something went wrong',
        });
    }
};

const postReply = async (req, res, next) => {
    const { commentId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        return res.status(403).json({
            error: 'You must be logged in to comment',
        });
    }

    const reply = {
        body,
        user: req.user,
    };

    try {
        await Comment.findOneAndUpdate(
            { _id: commentId },
            { $push: { replies: reply } },
            { new: true }
        );
        return res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics,
            username: req.user.username,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Something went wrong',
        });
    }
};

module.exports = { postComment, postReply };
