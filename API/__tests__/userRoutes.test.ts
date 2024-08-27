import request from 'supertest';
import express from 'express';
import userRouter from '../src/routes/userRoutes'; // Assurez-vous que le chemin est correct

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('User Routes', () => {
  test('GET /read/:id should return user details', async () => {
    const response = await request(app)
      .get('/user/read/1') // Remplacez par l'ID de l'utilisateur
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });
});
