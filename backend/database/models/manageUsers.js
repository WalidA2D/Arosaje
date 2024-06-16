const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation, encryptMethod, validateUserInputCreation } = require('../../framework/DreamTeamUtils');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur manageUsers.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : manageUsers.js');
    }
});

// CREER UN UTILISATEUR
const addUser = async (lastName, firstName, email, address, phone, cityName, password) => {
    try {
        const date = new Date();
        const passwordEncrypted = encryptMethod(password)
        const validation = validateUserInputCreation(lastName, firstName, email, address, phone, cityName);
        if (!validation.valid) {
            console.error('Validation Error: ', validation.message);
            return { 
                status: 400, 
                success: false, 
                message: validation.message 
            };
        }

        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const resRandomNumber = getRandomNumber(
            getRandomNumber(
                date.getMilliseconds() * date.getSeconds(),
                getRandomNumber(date.getFullYear()*6, password.length)
            ),
            getRandomNumber(
                date.getMonth() * date.getMinutes(),
                getRandomNumber(date.getTime()*6, date.getMilliseconds() * 2)
            )
        );
        let uid = firstName+ lastName + cityName + password.length
        let uidResult = ''

        const forbiddenChars = ['"', "'", '\\', '/', '<', '>', '&', '%', '@', '`', '?', " ","%","|"];

        for (let i = 0; i < uid.length; i++) {
            let charCode = uid.charCodeAt(i);
            let newCharCode;
            let validChar = false;

            while (!validChar) {
                newCharCode = charCode + resRandomNumber;

                // Si newCharCode dépasse la plage des caractères imprimables, on le réajuste
                if (newCharCode < 32 || newCharCode > 126) {
                    newCharCode = ((newCharCode - 32) % 95) + 32;
                }

                const newChar = String.fromCharCode(newCharCode);

                // Vérifie si le nouveau caractère est valide et non interdit
                if (newCharCode >= 32 && newCharCode <= 126 && !forbiddenChars.includes(newChar)) {
                    validChar = true;
                } else {
                    charCode++;
                }
            }

            uidResult += String.fromCharCode(newCharCode);
        }

        const sql = 'INSERT INTO Users (lastName, firstName, email, address, phone, cityName, password, uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [lastName, firstName, email, address, phone, cityName, passwordEncrypted, uidResult], function (err) {
                callback(err, { lastID: this.lastID });
            });
        });
        return { 
            body: result,
            status: 200, 
            success: true,
        };
    } catch (e) {
        console.error('Erreur lors de la fonction addUser', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// LIRE UN USER SELON L'UID
const getUser = async (uid) => {
    try {
        const sql = 'SELECT lastName, firstName, email, address, phone, cityName FROM Users WHERE Users.uid = ?';
        const rows = await handleDBOperation((callback) => {
            db.all(sql, [uid], callback);
        });
        return { 
            body: rows,
            status: 200, 
            success: true 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction getUser', e);
        return { 
            status: 400, 
            success: false,
            message: "Utilisateur non récupéré"
        };
    }
};

// UPDATE UN USER
const updateUser = async (uid, lastName, firstName, email, address, phone, cityName) => {
    try {
        const sql = 'UPDATE Users SET lastName = ?, firstName = ?, email = ?, address = ?, phone = ?, cityName = ? WHERE uid = ?';
        await handleDBOperation((callback) => {
            db.run(sql, [lastName, firstName, email, address, phone, cityName, uid], callback);
        });
        return { 
            message: 'Update réussit', 
            status: 200, 
            success: true,
            user: {
                "token":u.uid,
                "lastName":u.lastName,
                "firstName":u.firstName,
                "email":u.email,
                "address":u.address,
                "cityName":u.cityName,
                "phone":u.phone
            } 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction updateUser', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// obtenir un user selon l'email
const getUserByEmail = async (email) => {
    try {
        const sql = 'SELECT lastName, firstName, email, address, phone, cityName, password, uid FROM Users WHERE email = ?';
        const user = await handleDBOperation((callback) => {
            db.get(sql, [email], callback);
        });
        return user;
    } catch (e) {
        console.error('Erreur lors de la fonction getUserByEmail', e);
        return null;
    }
};

// CONNEXION
const connexion = async (email, password) => {
    try {
        const u = await getUserByEmail(email);
        if (!u) {
            return { status: 404, success: false, message: 'Utilisateur non trouvé' };
        }
        const encryptedPassword = encryptMethod(password);
        if (encryptedPassword !== u.password) {
            return { status: 401, success: false, message: 'Mot de passe incorrect' };
        }
        return { 
            message: "Connexion réussit !",
            status: 200, 
            success: true, 
            user: {
                "token":u.uid,
                "lastName":u.lastName,
                "firstName":u.firstName,
                "email":u.email,
                "address":u.address,
                "cityName":u.cityName,
                "phone":u.phone
            } 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction de connexion', e);
        return { status: 500, success: false, message: 'Erreur interne du serveur' };
    }
};

module.exports = {
    addUser,
    getUser,
    updateUser,
    getUserByEmail,
    connexion
};