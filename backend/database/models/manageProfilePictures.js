const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const storage = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.resolve(__dirname, '..', 'images', folderName);
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const fileName = req.body.fileName;
        cb(null, fileName);
    }
});

const upload = (folderName) => multer({ storage: storage(folderName) }).single('image');

const addProfilePicture = (folderName, fileName, imageBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadInstance = upload(folderName);
        uploadInstance(imageBuffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Image ajoutée avec succès' });
            }
        });
    });
};

const getProfilePicture = async (folderName, fileName) => {
    try {
        const filePath = path.resolve(__dirname, '..', 'images', folderName, fileName);
        const data = await fs.readFile(filePath);
        return data;
    } catch (err) {
        throw err;
    }
};

const deleteImage = async (folderName, fileName) => {
    try {
        const filePath = path.resolve(__dirname, '..', 'database', 'images', folderName, fileName);
        await fs.unlink(filePath);
        return { message: 'Image supprimée avec succès' };
    } catch (err) {
        throw err;
    }
};

module.exports = { 
    addProfilePicture,
    getProfilePicture,
    deleteImage
};
