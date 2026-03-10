// src/config/multer.js

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    // tentukan folder penyimpanan
    destination: (req, file, cb) => {
        cb(null, 'src/uploads')
    },

    // tentukan nama file - pakai timestamp biar tidak duplikat
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `car-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
    }
})

//Filter - hanya terima file gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        'video/mp4', 'video/mov', 'video/quictime', 'video/x-msvideo'
    ]
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error('Hanya file gambar / video yang diizinkan (jpg/jpeg/webp/mp4/mov)'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // maksimal 50mb
})

module.exports = upload