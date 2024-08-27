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
      .send({ /* données de test */ });
    expect(response.status).toBe(200);
  });

  test('GET /read should return favorites', async () => {
    const response = await request(app).get('/fav/read');
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
