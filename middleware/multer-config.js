const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // const name = file.originalname.split(' ').join('_').replace('/\.[a-zA-Z]{3,4}$/', '');
        const MIME_TYPES = {
            'image/jpg': 'jpg',
            'image/jpeg': 'jpg',
            'image/png': 'png',
        }

        const extension = MIME_TYPES[ file.mimetype ];
        const name = `${file.fieldname}${Date.now()}.${extension}`;

        callback(null, name);

        // callback(null, name + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');