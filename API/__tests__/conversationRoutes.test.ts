import request from 'supertest';
import express from 'express';
import convRouter from '../src/routes/conversationRoutes';

const app = express();
app.use(express.json());
app.use('/conversation', convRouter);

describe('Conversation Routes', () => {
  test('POST /add should add a conversation', async () => {
    const response = await request(app)
      .post('/conversation/add')
      .send({ /* données de test */ });
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
