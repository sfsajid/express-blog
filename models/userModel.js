const { Schema, model } = require('mongoose');
// const Profile = require('./profileModel');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            maxlength: 15,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            // minlength: 8,
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
        },
        profilePics: {
            type: String,
            default: '/images/default.png',
        },
        role: {
            type: String,
            default: 'user',
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;
