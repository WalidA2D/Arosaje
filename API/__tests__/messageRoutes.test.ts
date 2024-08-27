import request from 'supertest';
import express from 'express';
import messageRouter from '../src/routes/messageRoutes';

const app = express();
app.use(express.json());
app.use('/message', messageRouter);

describe('Message Routes', () => {
  test('POST /add should add a message', async () => {
    const response = await request(app)
      .post('/message/add')
      .send({ /* données de test */ });
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
