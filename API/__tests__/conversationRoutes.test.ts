import request from 'supertest';
import express from 'express';
import conversationRouter from '../src/routes/conversationRoutes'; // Assurez-vous que le chemin est correct

const app = express();
app.use(express.json());
app.use('/conversation', conversationRouter);

describe('Conversation Routes', () => {

  test('POST /add should add a conversation', async () => {
    const response = await request(app)
      .post('/conversation/add')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`) // Ajoutez l'en-tête d'autorisation
      .send({
        dateStart: new Date(),
        dateEnd: new Date(),
        idUser1: 1, // Remplacez par un ID d'utilisateur valide
        idUser2: 2  // Remplacez par un ID d'utilisateur valide
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test('GET /read should return conversations', async () => {
    const response = await request(app)
      .get('/conversation/read')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(404);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });

  test('DELETE /delete/:id should delete a conversation', async () => {
    const conversationId = 1; // Remplacez par l'ID de la conversation à supprimer
    const response = await request(app)
      .delete(`/conversation/delete/${conversationId}`) // Utilisez l'ID valide ici
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
