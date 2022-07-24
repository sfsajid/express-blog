const { Schema, model } = require('mongoose');

const User = require('./userModel');
const Post = require('./postModel');

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        nickname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        bio: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        profilePics: String,
        links: {
            website: String,
            facebook: String,
            twitter: String,
            github: String,
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: Post,
            },
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: Post,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Profile = model('Profile', profileSchema);

module.exports = Profile;
