const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

// Internal Modules
const { bindUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

// MongoDB Store
const store = new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2,
});

const midddlewares = [
    morgan('dev'),
    express.static('public'),
    express.json(),
    express.urlencoded({ extended: true }),
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store,
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
];

module.exports = (app) => {
    midddlewares.forEach((middleware) => app.use(middleware));
};
