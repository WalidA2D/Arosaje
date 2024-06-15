const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation, encryptMethod, validateUserInputCreation } = require('../../components/DreamTeamUtils');

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
        const uid = firstName+ lastName + cityName + date.getHours() + date.getMinutes() + date.getSeconds() + password.length + getRandomNumber(1, 100);
        console.log(uid)

        const sql = 'INSERT INTO Users (lastName, firstName, email, address, phone, cityName, password, uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [lastName, firstName, email, address, phone, cityName, passwordEncrypted, uid], function (err) {
                callback(err, { lastID: this.lastID });
            });
        });
        return { 
            status: 200, 
            success: true, 
            userId: result.lastID 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction addUser', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// LIRE LES USERS
const getAllUsers = async () => {
    try {
        const sql = 'SELECT * FROM Users';
        const rows = await handleDBOperation((callback) => {
            db.all(sql, [], callback);
        });
        return { 
            body: rows, 
            status: 200, 
            success: true 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction getAllUsers', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// UPDATE UN USER
const updateUser = async (uid, lastName, firstName, email, address, phone, cityName) => {
    try {
        const sql = 'UPDATE Users SET lastName = ?, firstName = ?, email = ?, address = ?, phone = ?, cityName = ? WHERE id = ?';
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
    getAllUsers,
    updateUser,
    getUserByEmail,
    connexion
};