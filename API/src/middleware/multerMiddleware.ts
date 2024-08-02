import multer from "multer";
import path from "path";

const sizeOneMb = 1048576;
const authSize = sizeOneMb * 50;

const storage = multer.memoryStorage();

const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: authSize },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array("image", 5);

const upload = multer({
  storage: storage,
  limits: { fileSize: authSize },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

function checkFileType(file: any, cb: any) {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Seuls les formats d'images jpeg, jpg, png sont acceptés"));
  }
}

export default { uploadMultiple, upload };
