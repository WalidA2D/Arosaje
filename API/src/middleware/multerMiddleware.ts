import multer from 'multer'
import path from 'path'
import fs from 'fs'

const sizeOneMb = 1048576;
const authSize = sizeOneMb * 50

const uploadMultiple = multer ({
    storage: multer.memoryStorage(),
    limits : { fileSize: authSize},
    fileFilter : async (req,file,cb) => {
        checkFileType(file,cb);
    }
}).array("image",5)

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize : authSize },
    fileFilter: async (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single("image")

function checkFileType(file:any, cb:any) {
    const fileTypes = /jpeg|jpg|png/
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimeType);

    if(mimeType && extName){
        return cb(null, true)
    } else {
        cb("Seul les formats d'images sont acceptés")
    }
}

export default { uploadMultiple, upload }