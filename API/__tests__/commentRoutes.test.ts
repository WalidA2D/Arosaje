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
      .send({ /* données de test */ });
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
