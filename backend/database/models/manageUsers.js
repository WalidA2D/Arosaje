const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation, encryptMethod } = require('../../components/DreamTeamUtils');

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
    const passwordEncrypted = encryptMethod(password)
    try {
        const sql = 'INSERT INTO Users (lastName, firstName, email, address, phone, cityName, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [lastName, firstName, email, address, phone, cityName, passwordEncrypted], function (err) {
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
const updateUser = async (id, name, age) => {
    try {
        const sql = 'UPDATE Users SET nom = ?, age = ? WHERE id = ?';
        await handleDBOperation((callback) => {
            db.run(sql, [name, age, id], callback);
        });
        return { 
            body: 'Update réussit', 
            status: 200, 
            success: true 
        };
    } catch (e) {
        console.error('Erreur lors de la fonction updateUser', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

module.exports = {
    addUser,
    getAllUsers,
    updateUser
};