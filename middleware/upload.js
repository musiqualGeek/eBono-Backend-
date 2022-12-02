const multer = require('multer')

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
        console.log('storage')
        if (file.fieldname == 'image') {
            cb(null, './uploads/image')
        } else {
            cb(null, './uploads/audio')
        }
    },
})
const upload = multer({ storage })

module.exports = upload

