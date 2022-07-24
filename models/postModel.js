const { Schema, model } = require('mongoose');

const User = require('./userModel');
const Comment = require('./commentModel');

const postschema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        body: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        thumbnail: {
            type: String,
            default: '/images/thumbnail.jpg',
        },
        url: {
            type: String,
            required: true,
        },
        readTime: String,
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: User,
            },
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: User,
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: Comment,
            },
        ],
    },
    {
        timestamps: true,
    }
);

postschema.index(
    {
        title: 'text',
        body: 'text',
        tags: 'text',
    },
    {
        weights: {
            title: 5,
            tags: 5,
            body: 2,
        },
    }
);

const Post = model('Post', postschema);

module.exports = Post;
