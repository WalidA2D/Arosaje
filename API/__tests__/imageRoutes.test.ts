import request from 'supertest';
import express from 'express';
import imageRouter from '../src/routes/imageRoutes';
import path from 'path'; // Importez le module path

const app = express();
app.use(express.json());
app.use('/image', imageRouter);

describe('Image Routes', () => {

  test('GET /pp/:id should return a profile picture', async () => {
    const response = await request(app)
      .get('/image/pp/1') // Remplacez par l'ID de l'image
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });

  test('PUT /resetPP should reset the profile picture', async () => {
    const response = await request(app)
      .put('/image/resetPP')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
