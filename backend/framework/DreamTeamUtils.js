const path = require('path');
const multer = require('multer')
const storage = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.resolve(__dirname, '..', 'database', 'images', folderName);
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const fileName = req.body.fileName; // Utiliser le nom de fichier spécifié dans le corps de la requête
        cb(null, fileName);
    }
});
const upload = (folderName) => multer({ storage: storage(folderName) }).single('image');

const handleDBOperation = (operation, params = []) => {
    return new Promise((resolve, reject) => {
        operation((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }, params);
    });
};

const executeDBOperation = (db, sql, params, type = 'run') => {
    return new Promise((resolve, reject) => {
        const stmnt = db.prepare(sql); // stmnt = statement = version compilée de la reuqete sql pour éviter les injections + rend plus rapide la requête
        const callback = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };

        if (type === 'all') {
            stmnt.all(params, callback);
        } else {
            stmnt.run(params, function(err) {
                callback(err, { lastID: this.lastID, changes: this.changes });
            });
        }

        switch(type){
            case "all":
                stmnt.all(params, callback)
                break
            case "get":
                stmnt.get(params, callback)
                break
            default:
                stmnt.run(params, (err)=>{
                    callback(err, { status: 500, success: false, message: 'Erreur interne du serveur' })
                })
                break
        }

        stmnt.finalize()
    });
};
const encryptMethod = (password) => {
    let result = '';
    let decalage = password.length + 4;
    const forbiddenChars = ['"', "'", '\\', '/', '<', '>', '&', '%', '@', '`', '?', " ", "%", "|"];

    for (let i = 0; i < password.length; i++) {
        let charCode = password.charCodeAt(i);

        let newCharCode = charCode + decalage; // Décaler avec code ASCII

        // Si newCharCode = NaN on le réajuste
        if (newCharCode < 32 || newCharCode > 126) {
            newCharCode = ((newCharCode - 32) % 95) + 32;
        }

        // Vérifier si newCharCode est autorisé
        let newChar = String.fromCharCode(newCharCode);
        while (forbiddenChars.includes(newChar)) {
            newCharCode++;
            if (newCharCode > 126) {
                newCharCode = 32;
            }
            newChar = String.fromCharCode(newCharCode);
        }
        result += newChar;
    }

    return result;
};
const validateUserInputCreation = (lastName, firstName, email, address, phone, cityName) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ'-\s]{1,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const addressRegex = /^.{1,50}$/; // On vérifie si ça fait bien 50
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const cityRegex = /^[a-zA-ZÀ-ÿ'-\s]{1,50}$/;

    if (!nameRegex.test(lastName)) {
        return { valid: false, message: 'Invalid last name' };
    }

    if (!nameRegex.test(firstName)) {
        return { valid: false, message: 'Invalid first name' };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email' };
    }

    if (!addressRegex.test(address)) {
        return { valid: false, message: 'Invalid address' };
    }

    if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Invalid phone number' };
    }

    if (!cityRegex.test(cityName)) {
        return { valid: false, message: 'Invalid city name' };
    }

    return { valid: true, message: 'Validation successful' };
};

const uploadImage = (image, fileName, folderName) => {
    return new Promise((resolve, reject) => {
        const uploadInstance = upload(folderName);
        uploadInstance(image, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Image téléchargée avec succès', fileName: fileName, folderName: folderName });
            }
        });
    });
};

const addProfilePicture = (folderName, fileName, imageBuffer) => {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(__dirname, '..', 'database', 'images', folderName, fileName);
        fs.writeFile(filePath, imageBuffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Image ajoutée avec succès' });
            }
        });
    });
};


const getProfilePicture = (folderName, fileName) => {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(__dirname, '..', 'database', 'images', folderName, fileName);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const deleteImage = (folderName, fileName) => {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(__dirname, '..', 'database', 'images', folderName, fileName);
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Image supprimée avec succès' });
            }
        });
    });
};

module.exports = { 
    handleDBOperation, 
    encryptMethod, 
    validateUserInputCreation,
    uploadImage,
    executeDBOperation,
    addProfilePicture,
    getProfilePicture,
    deleteImage
};