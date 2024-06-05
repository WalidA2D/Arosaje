const sqlite3 = require('sqlite3');

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static all(db) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => new User(row.id, row.name, row.email)));
      });
    });
  }

  save(db) {
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
        db.run('INSERT INTO users (name, email) VALUES (?, ?)', [this.name, this.email], function(err) {
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
