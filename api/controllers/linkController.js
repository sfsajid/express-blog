const Post = require('../../models/postModel');

const checkUrl = async (req, res, next) => {
    const { url } = req.query;

    const invalidUrl = ['newpost', 'editpost', 'posts', 'login', 'register', 'logout'];
    if (invalidUrl.includes(url)) {
        return res.status(400).json({
            url: false,
            error: 'This URL is not available',
        });
    }
    if (url.length < 5) {
        return res.status(400).json({
            url: false,
            error: 'URL needs to be at least 5 characters',
        });
    }
    try {
        const post = await Post.findOne({ url });
        if (post) {
            res.json({ url: false, id: post._id });
        } else {
            res.json({ url: true });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    checkUrl,
};
