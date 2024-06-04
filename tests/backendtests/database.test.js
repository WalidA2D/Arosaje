const sqlite3 = require('sqlite3');
const User = require('../../backend/database/models/createUser');

describe('Database Content Test', () => {
  let db;

  beforeAll((done) => {
    // Connexion à la base de données de test
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Erreur lors de la connexion à la base de données de test : ', err);
        done();
      }
      // Création de la table de test
      db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE)', (err) => {
        if (err) {
          console.error('Erreur lors de la création de la table de test : ', err);
          done();
        }
        // Insertion de quelques données de test
        db.run("INSERT INTO users (name, email) VALUES ('Test User 1', 'test1@example.com')");
        db.run("INSERT INTO users (name, email) VALUES ('Test User 2', 'test2@example.com')");
        done();
      });
    });
  });

  afterAll((done) => {
    // Fermeture de la base de données de test après les tests
    db.close((err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la base de données de test : ', err);
      }
      done();
    });
  });

  test('Check if database contains users', (done) => {
    // Teste si la fonction all() de User retourne les utilisateurs correctement
    User.all(db)
      .then((users) => {
        expect(users).toHaveLength(2); // Nous nous attendons à ce qu'il y ait 2 utilisateurs
        done();
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des utilisateurs : ', err);
        done();
      });
  });
});
