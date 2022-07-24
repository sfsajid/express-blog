require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');

// app
const app = express();

// Middlewares
const setMiddlewares = require('./middleware/middlewares');

// Routes
const setRoutes = require('./routes/routes');

// View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// using middlewares from middleware.js
setMiddlewares(app);

// Using Routes From Routes.js
setRoutes(app);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/error/error', {
            title: '404 Page Not Found',
            flashMessage: {},
            name: '404 - Page Not Found',
            message:
                'The page you are looking for might have been removed had its name changed or is temporarily unavailable.',
        });
    }
    console.log(chalk.red.inverse(error.message));
    console.log(chalk.red(error));
    return res.render('pages/error/error', {
        title: '500 Internal Server Error',
        flashMessage: {},
        name: '500 - Internal Server Error',
        message: 'Something went wrong. Please try again later.',
    });
});

const { PORT } = process.env;

const runApp = async () => {
    await mongoose.connect(process.env.DATABASE_URL).catch((err) => console.log(err));
    console.log(chalk.green.inverse('Database Connected'));
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
runApp();
