const sharp = require('sharp');
const fs = require('fs');

const imageMiddleware = async (req, res, next) => {
    if (req.file) {
        const { filename } = req.file;
        const [, ext] = filename.split('.');
        const image = await sharp(req.file.path).resize(1024).toFormat(ext).toBuffer();
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        await sharp(image).toFile(`${__dirname}/../public/uploads/${filename}`);
        req.image = {
            filename,
            path: `/uploads/${filename}`,
        };
    }
    next();
};
module.exports = imageMiddleware;
