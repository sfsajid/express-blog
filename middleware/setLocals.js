const cheerio = require('cheerio');
const moment = require('moment');

module.exports = () => (req, res, next) => {
    res.locals.user = req.user;
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.truncate = (html) => {
        let text = cheerio.load(html).text();
        text = text.replace(/\r\r|\n\r/gm, '');

        return text.length <= 100 ? text : `${text.substring(0, 100)}...`;
    };

    res.locals.cmTruncate = (text, length) => {
        const nText = text.replace(/\r\r|\n\r/gm, '');
        if (nText.length <= length) {
            return nText;
        }
        return `${nText.substring(0, length)}...`;
    };

    res.locals.moment = (time) => {
        const str = moment(time).fromNow();
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    res.locals.toDecimal = (hex) => {
        const temp = `${hex}`;
        return parseInt(temp.slice(0, 10).toUpperCase(), 16);
    };
    res.locals.formatDate = (time, format) => moment(time).format(format);
    res.locals.round = (num) => (Math.round(num) > 0 ? Math.round(num) : 1);
    next();
};
