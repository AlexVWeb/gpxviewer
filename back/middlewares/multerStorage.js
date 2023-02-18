const multer = require('multer')
const path = require('path');

const MIME_TYPES = {
    'application/octet-stream': 'gpx',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (isGpxFile(file.originalname)) {
            callback(null, 'uploads');
        }
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0]
        const extension = MIME_TYPES[file.mimetype]
        if (isGpxFile(file.originalname)) {
            callback(null, `${name}.${extension}`)
        } else {
            callback('Not a gpx file', null)
        }
    }
})

function isGpxFile(filePath) {
    const ext = path.extname(filePath);
    return ext === '.gpx';
}

module.exports = storage