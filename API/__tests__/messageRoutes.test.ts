import request from 'supertest';
import express from 'express';
import messageRouter from '../src/routes/messageRoutes';
import path from 'path'; // Importez le module path

const app = express();
app.use(express.json());
app.use('/message', messageRouter);

describe('Message Routes', () => {
  test('POST /add should add a message', async () => {
    const response = await request(app)
      .post('/msg/add')
      .set('Authorization', '1f2db30d-2485-4457-8029-1ba9ffd03627') // Ajoutez l'en-tête d'autorisation
      .field('text', 'Test message') // Ajoutez le champ text
      .field('publishedAt', new Date().toISOString())
      .field('idConversation', '1') // ID de la conversation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("Message bien ajouté");
  });

  test('GET /read should return user messages', async () => {
    const response = await request(app)
      .get('/message/read')
      .set('Authorization', '1f2db30d-2485-4457-8029-1ba9ffd03627'); // Ajoutez l'en-tête d'autorisation
    expect(response.status).toBe(200);
  });

  test('GET /messages/:id should return messages by conversation', async () => {
    const response = await request(app)
      .get('/message/messages/1f2db30d-2485-4457-8029-1ba9ffd03627')
      .set('Authorization', '1f2db30d-2485-4457-8029-1ba9ffd03627'); // Ajoutez l'en-tête d'autorisation
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
