const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('../BASE.db',sqlite.OPEN_READWRITE,(err)=>{
    if(err.errno == 14) {
       console.log("Fichier BASE.db trouvé")
    } else if (err){
        return console.error(err)
    } else {
        console.log("Connecté au serveur SQL")
    }
})


// CREER UN UTILISATEUR
const addUser = async (name, age) => {
    try{
        const sql = `INSERT INTO users (name,age) VALUES (?,?)` // les ? pour éviter les injections
        db.run(sql, [name, age], (err) => {
            callback(err, { id: this.lastID })
        })
    } catch(e){
        console.error('',e)
    }
}

// LIRE LES USERS
const getAllUsers = async (callback) => {
    try{
        const sql = `SELECT * FROM users`
        db.all(sql, [], callback)
    } catch(e){
        console.error('',e)
    }
}

// UPDATE UN USER
const updateUser = async (id,name,age, callback) => {
    try{
        const sql = 'UPDATE users SET name = ?, age = ? WHERE id = ?'
        db.run(sql, [name,age,id],callback)
    } catch(e){
        console.error('',e)
    }
}

module.exports = {
    addUser,
    getAllUsers,
    updateUser
}