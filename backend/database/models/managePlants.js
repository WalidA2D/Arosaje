const path = require('path');
const sqlite = require('sqlite3').verbose();
const { handleDBOperation } = require('../../components/DreamTeamUtils');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur managePlants.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : managePlants.js');
    }
});

// AJOUTER UNE PLANTE
const addPlant = async (description, origin, requirements, type) => {
    try {
        const sql = 'INSERT INTO Plants (description, origin, requirements, type) VALUES (?, ?, ?, ?)';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [description, origin, requirements, type], function (err) {
                callback(err);
            });
        });
        console.log("Nouvelle plante créée , Type : ",type)
        return { 
            body: "Plante créée!!!",
            status: 200, 
            success: true
        };
    } catch (e) {
        console.error('Erreur lors de la fonction addPlant', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

// GET TOUTES LES PLANTES
const getPlantWithID = async (plantID) => {
    try {
        const sql = 'SELECT * FROM Plants WHERE idPlants = ?';
        const result = await handleDBOperation((callback) => {
            db.run(sql, [plantID], function (err) {
                callback(err);
            });
        });
        return { 
            body: result,
            status: 200, 
            success: true
        };
    } catch (e) {
        console.error('Erreur lors de la fonction getPlantWithID', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

module.exports = {
    addPlant,
    getPlantWithID
}