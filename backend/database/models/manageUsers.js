const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation } = require('../../components/DreamTeamUtils');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL');
    }
});

// CREER UN UTILISATEUR
const addUser = async (name, age) => {
    try {
        const sql = 'INSERT INTO users (nom, age) VALUES (?, ?)';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [name, age], function (err) {
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
        const sql = 'SELECT * FROM users';
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
        const sql = 'UPDATE users SET nom = ?, age = ? WHERE id = ?';
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
