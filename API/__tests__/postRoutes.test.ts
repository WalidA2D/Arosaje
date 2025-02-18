import request from 'supertest';
import express from 'express';
import postRouter from '../src/routes/postRoutes';
import path from 'path'; // Importez le module path

const app = express();
app.use(express.json());
app.use('/post', postRouter);

describe('Post Routes', () => {

  test('GET /read should return posts', async () => {
    const response = await request(app)
      .get('/post/read')
      .set('Authorization', '1f2db30d-2485-4457-8029-1ba9ffd03627'); // Ajoutez l'en-tête d'autorisation
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
