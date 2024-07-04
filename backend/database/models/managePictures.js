const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const sqlite = require('sqlite3').verbose();
const { executeDBOperation, encryptMethod, validateUserInputCreation } = require('../../framework/DreamTeamUtils');
const pathToDB = path.resolve(__dirname, '..', 'BASE.db');
const db = new sqlite.Database(pathToDB, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erreur manageUsers.js lors de la connexion à la BDD : \n', err);
    } else {
        console.log('Connecté au serveur SQL : managePictures.js');
    }
});

const extPic = 'png'

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

const addPicture = async (folderName, fileName, base64Data) => {
    try {
        const filePath = path.resolve(__dirname, '..', 'images', folderName, fileName);
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(filePath, buffer);
        return { message: 'Image ajoutée avec succès', success:true };
    } catch (e) {
        throw e;
    }
};

const getProfilePicture = async (idUser) => {
    try {
        const defaultPicPath = path.resolve(__dirname, '..', 'images', "profilePictures", `default_pp.${extPic}`)
        const fileName = idUser + "_pp." + extPic
        const filePath = path.resolve(__dirname, '..', 'images', "profilePictures", fileName);

        let data;
        try{
            data = await fs.readFile(filePath);
        } catch (e) {
            data = await fs.readFile(defaultPicPath)
        }
        const base64Image = data.toString('base64'); //conversion en base64
        return {
            status: 200,
            success: true,
            body: base64Image
        }
    } catch (e) {
        console.error(e);
    }
};

const deleteImage = async (folderName, fileName) => {
    try {
        const filePath = path.resolve(__dirname, '..', 'images', folderName, fileName);
        await fs.unlink(filePath);
        return { message: 'Image supprimée avec succès' };
    } catch (e) {
        throw e;
    }
};

const setPP = async(token, profilePic) => {
    try{
        const sql = 'SELECT idUsers FROM Users WHERE Users.uid = ?';
        const u = (await executeDBOperation(db, sql, [token], "all"))[0];

        if(!u) return  { message:"Utilisateur non trouvé pour l'update de PP", status: 400, success: false }

        let fileName = `${u.idUsers}_pp.${extPic}`

        try {
            await deleteImage("profilePictures", fileName);
        } catch (e) {
        }

        await addPicture("profilePictures",fileName, profilePic);

        return { 
            message: 'Mise à jour de l\'image de profil réussie', 
            status: 200, 
            success: true
        }

    } catch (e) {
        console.error("Erreur lors de la fonction setPP : ",e)
        return { 
            status: 400, 
            success: false 
        }
    }
}

const resetPP = async(token) => {
    try{
        const sql = 'SELECT idUsers FROM Users WHERE Users.uid = ?';
        const u = (await executeDBOperation(db, sql, [token], "all"))[0];

        if(!u) return  { message:"Utilisateur non trouvé pour le reset de PP", status: 400, success: false }

        const fileName = `${u.idUsers}_pp.${extPic}`
        try {
            await deleteImage("profilePictures", fileName);
        } catch (e) {
            return  { message:"Aucune PP déjà existante pour ce compte", status: 400, success: false }
        }

        const ppU = await getProfilePicture("default")

        return  { message:"PP bien réinitialisée", status: 200, success: true, body : ppU }
    } catch (e){
        console.error("Erreur lors de la fonction resetPP : \n",e)
        return { 
            status: 400, 
            success: false 
        }
    }
}

const setPlantsImages = async (images, idU) => {
    try {
        let i = 0;
        for (let image of images) {
            const sql = 'INSERT INTO Plants (description, origin, requirements, type, idUser) VALUES (?, ?, ?, ?, ?)';
            await executeDBOperation(db, sql, [description, origin, requirements, type, idU]);

            const sqlAddPath = 'INSERT INTO Images (title,url,idPlant) VALUES (?,?,?)'
            await executeDBOperation(db, sql, [type, origin, requirements, type, idU]);

            await addPicture("plants", `${idU}_plant`, image);
        }
        return { message: 'Toutes les images ont été ajoutées avec succès', success: true };
    } catch (e) {
        console.error("Erreur lors de la fonction setPostImages : \n", e);
        return { 
            status: 400, 
            success: false 
        }
    }
};

module.exports = { 
    addPicture,
    getProfilePicture,
    deleteImage,
    setPP,
    resetPP,
    setPlantsImages
};
