import request from 'supertest';
import express from 'express';
import favRouter from '../src/routes/favRoutes';

const app = express();
app.use(express.json());
app.use('/fav', favRouter);

describe('Favorite Routes', () => {

  test('POST /add should add a favorite', async () => {
    const response = await request(app)
      .post('/fav/add')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`) // Ajoutez l'en-tête d'autorisation
      .send({
        id: 1, // ID du post à ajouter en favori
        userId: '1'  // Remplacez par l'ID de l'utilisateur
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("Favori bien ajouté");
  });

  test('GET /read should return favorites', async () => {
    const response = await request(app)
      .get('/fav/read')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });

  test('DELETE /delete/:id should delete a favorite', async () => {
    const response = await request(app)
      .delete('/fav/delete/1') // Remplacez par l'ID du favori à supprimer
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("Favori bien supprimé");
  });

  // Ajoutez d'autres tests pour les autres routes...
});
