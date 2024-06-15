const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const basePath = './images/Plants';
        fs.readdir(basePath, (err, files) => {
            if (err) {
                return cb(err);
            }
            const newFolderName = `PlanteNumber${files.length + 1}`;
            const newFolderPath = path.join(basePath, newFolderName);
            fs.mkdirSync(newFolderPath, { recursive: true });
            req.newFolderPath = newFolderPath;
            cb(null, newFolderPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

module.exports = multer({ storage });