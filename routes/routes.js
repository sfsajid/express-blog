const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');
const uploadRoute = require('./uploadRoute');
const postRoute = require('./postRoute');
const searchRoute = require('./searchRoute');
const userRoute = require('./userRoute');
const homeRoute = require('./homeRoute');
const adminRoute = require('./adminRoute');

const apiRoutes = require('../api/routes/apiRoutes');

const routes = [
    {
        path: '/auth',
        handler: authRoute,
    },
    {
        path: '/dashboard',
        handler: dashboardRoute,
    },
    {
        path: '/uploads',
        handler: uploadRoute,
    },
    {
        path: '/posts',
        handler: postRoute,
    },
    {
        path: '/api',
        handler: apiRoutes,
    },
    {
        path: '/search',
        handler: searchRoute,
    },
    {
        path: '/admin',
        handler: adminRoute,
    },
    {
        path: '/user',
        handler: userRoute,
    },
    {
        path: '/',
        handler: homeRoute,
    },
];

module.exports = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.handler);
    });
};
