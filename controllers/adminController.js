const User = require('../models/userModel');
const Flash = require('../utils/flash');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' })
            .select({
                password: 0,
                __v: 0,
            })
            .populate({
                path: 'profile',
                select: 'posts createdAt',
            });

        const activeUsers = users.filter((user) => user.verified);

        res.render('pages/dashboard/admin/users', {
            title: 'Users',
            flashMessage: Flash.getMessage(req),
            active: {
                admin: true,
                users: true,
            },
            users,
            activeUsers,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
};
