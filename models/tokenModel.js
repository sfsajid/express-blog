const { Schema, model } = require('mongoose');

const tokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expireAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: '2h',
        },
    },
    {
        timestamps: true,
    }
);

const Token = model('Token', tokenSchema);

module.exports = Token;
