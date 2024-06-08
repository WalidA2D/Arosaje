const path = require('path')
const sqlite = require('sqlite3').verbose()
const pathToDB = path.resolve(__dirname,"..", "Base.db")
const db = new sqlite.Database(pathToDB,sqlite.OPEN_READWRITE,(err)=>{
    if (err){
        return console.error("Erreur lors de la connexion à la BDD : \n",err)
    } else {
        console.log("Connecté au serveur SQL")
    }
})


// CREER UN UTILISATEUR
const addUser = async (name, age) => {
    try {
        const sql = `INSERT INTO users (nom, age) VALUES (?, ?)`;
        return await new Promise((resolve, reject) => {
            db.run(sql, [name, age], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Nouvel utilisateur - ID : ${this.lastID}`);
                    resolve({ status: 200, success: true, userId: this.lastID });
                }
            });
        });
    } catch (e) {
        console.error('Erreur lors de la fonction addUser', e);
        return { status: 400, success: false };
    }
};


// LIRE LES USERS
const getAllUsers = async () => {
    try{
        const sql = `SELECT * FROM users`
        const response = db.all(sql, [])
        return response
    } catch(e){
        console.error('Erreur lors de la fonction getAllUsers',e)
    }
}

// UPDATE UN USER
const updateUser = async (id,name,age, callback) => {
    try{
        const sql = 'UPDATE users SET nom = ?, age = ? WHERE id = ?'
        db.run(sql, [name,age,id],callback)
    } catch(e){
        console.error('Erreur lors de la fonction updateUser',e)
    }
}

module.exports = {
    addUser,
    getAllUsers,
    updateUser
}