const fs = require('fs');

const User = require('../models/userModel');
const Profile = require('../models/profileModel');

const uploadProfilePicture = async (req, res, next) => {
    try {
        if (req.file) {
            const uPath = `${__dirname}/../public`;
            const oldPic = `${uPath}${req.user.profilePics}`;
            const profile = await Profile.findOne({ user: req.user._id });
            const profilePics = `/uploads/profile/${req.file.filename}`;
            if (profile) {
                await Profile.findOneAndUpdate({ user: req.user._id }, { $set: { profilePics } });
            }

            await User.findOneAndUpdate({ _id: req.user._id }, { $set: { profilePics } });
            res.status(200).json({
                profilePics,
            });
            console.log(oldPic);
            if (oldPic !== `${uPath}/images/default.png`) {
                fs.unlink(oldPic, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            profilePics: req.user.profilePics,
        });
    }
};

const removeProfilePicture = (req, res, next) => {
    try {
        const uPath = `${__dirname}/../public/`;

        fs.unlink(`${uPath}${req.user.profilePics}`, async (err) => {
            const profile = await Profile.findOne({ user: req.user._id });
            if (profile) {
                console.log('here');
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics: '/images/default.png' } }
                );
            }
            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics: '/images/default.png' } }
            );
            if (err) {
                console.log(err);
            }
        });

        res.status(200).json({
            profilePics: '/images/default.png',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting profile picture',
        });
    }
};

const postImage = async (req, res, next) => {
    if (req.image) {
        res.status(200).json({
            link: `${req.image.path}`,
        });
    }
};

const getImage = async (req, res, next) => {
    const imageFolder = `${__dirname}/../public/uploads`;
    const images = [];
    console.log('here');
    fs.readdir(imageFolder, { withFileTypes: true }, (err, dirents) => {
        const files = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
        files.forEach((file) => {
            images.push({
                url: `/uploads/${file}`,
            });
        });
        res.status(200).json(images);
    });
};

module.exports = { uploadProfilePicture, removeProfilePicture, postImage, getImage };
