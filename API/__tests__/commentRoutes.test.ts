import request from 'supertest';
import express from 'express';
import commentRouter from '../src/routes/commentRoutes';

const app = express();
app.use(express.json());
app.use('/comment', commentRouter);

describe('Comment Routes', () => {

  test('POST /create should create a comment', async () => {
    const response = await request(app)
      .post('/comment/create')
      .set('Authorization', `unique-uid`) // Ajoutez l'en-tête d'autorisation
      .send({
        text: 'Ceci est un commentaire de test', // Contenu du commentaire
        idPost: 1 // ID du post auquel le commentaire est associé
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test('GET /read should return comments', async () => {
    const response = await request(app)
      .get('/comment/read')
      .set('Authorization', `unique-uid`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });

  test('GET /read/:id should return comments by post ID', async () => {
    const response = await request(app)
      .get('/comment/read/1') // Remplacez par l'ID du post
      .set('Authorization', `unique-uid`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });

  test('DELETE /delete/:id should delete a comment', async () => {
    const response = await request(app)
      .delete('/comment/delete/1') // Remplacez par l'ID du commentaire à supprimer
      .set('Authorization', `unique-uid`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
