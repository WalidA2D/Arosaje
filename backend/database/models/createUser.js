const sqlite3 = require('sqlite3');
const path = require('path');
const { DATABASE_URL } = require('../../config/config');

const dbPath = path.resolve(__dirname, '..', DATABASE_URL);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données : ', err.message);
    } else {
        console.log('Connexion à la base de données réussie');
    }
});

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static all() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            if (this.id) {
                db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [this.name, this.email, this.id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            } else {
                db.run('INSERT INTO users (name, email) VALUES (?, ?)', [this.name, this.email], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.id = this.lastID;
                    resolve();
                }.bind(this));
            }
        });
    }
}

module.exports = User;
