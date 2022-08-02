const multer = require('multer');


const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


//set storage  for multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[ file.mimetype ];
        const name = `${file.fieldname}${Date.now()}.${extension}`;
        callback(null, name);
    }
});

const upload = multer(
    {
        storage: storage,
        fileFilter: (req, file, cb) => {
            //if mime type different from MIME_TYPES reject
            if (!Object.keys(MIME_TYPES).includes(file.mimetype)) {
                cb("File type not allowed", false)
            } else {
                cb(null, true)
            }
        }
    }
)

module.exports = upload.single('image');