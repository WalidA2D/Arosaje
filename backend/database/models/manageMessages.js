const path = require('path');
const sqlite = require('sqlite3').verbose();
const { executeDBOperation } = require('../../framework/DreamTeamUtils');
const managePic = require('./managePictures');

const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur manageMessages.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : manageMessages.js');
    }
});

// AJOUTER UNE CONVERSATION
const addConv = async (description, origin, requirements, type, token, images) => {
    try {
        const sqlIdU = 'SELECT idUsers FROM Users WHERE uid = ?'
        const idU = (await executeDBOperation(db, sqlIdU, [token], 'all'))[0];

        if(!idU) return {status:404, success:false, message:"Utilisateur non trouvé"}

        const sql = 'INSERT INTO Plants (description, origin, requirements, type, iduser) VALUES (?, ?, ?, ?, ?)';
        await executeDBOperation(db, sql, [description, origin, requirements, type, idU]);
        
        const sqlIdP = 'SELECT idPlants FROM Plants WHERE idUser = ? ORDER BY idPlants DESC LIMIT 1'
        const idP = (await executeDBOperation(db, sqlIdU, [idU], 'all'))[0];
        await setPlantsImages(images, idU, idP)

        console.log("Nouvelle plante créée , Type : ",type)
        return { 
            message: "Plante créée!!!",
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

// GET PLANTE PAR ID
const getPlantWithID = async (plantID) => {
    try {
        if(plantID == undefined || plantID == null || plantID < 0 || !Number.isInteger(plantID)){
            return { 
                message:"ID incorrect",
                status: 400, 
                success: false 
            };
        }
        //const sql = 'SELECT idPlants, description, origin, requirements, type, idUser FROM Plants WHERE idPlants = ?';
        const sql = 'SELECT * FROM Plants';
        const result = await executeDBOperation(db, sql, [plantID], "all");
        if (result) {
            return { 
                body: result,
                status: 200, 
                success: true
            };
        } else {
            console.error('Aucune plante trouvée avec l\'ID :', plantID);
            return { 
                message: 'Plante non trouvée',
                status: 404, 
                success: false
            };
        }
    } catch (e) {
        console.error('Erreur lors de la fonction getPlantWithID', e);
        return { 
            status: 400, 
            success: false 
        };
    }
};

module.exports = {
    addConv,
    getPlantWithID
}