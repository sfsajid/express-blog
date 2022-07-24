const multer = require('multer');
const path = require('path');

const uPath = `${__dirname}/../public/uploads`;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const regex = /profilePics/;
        if (regex.test(file.fieldname)) {
            cb(null, `${uPath}/profile`);
        } else {
            cb(null, uPath);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png/;
        const extName = types.test(path.extname(file.originalname).toLowerCase());
        if (extName) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
});

module.exports = upload;
