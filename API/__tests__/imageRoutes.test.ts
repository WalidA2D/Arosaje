import request from 'supertest';
import express from 'express';
import imageRouter from '../src/routes/imageRoutes';
import path from 'path'; // Importez le module path

const app = express();
app.use(express.json());
app.use('/image', imageRouter);

describe('Image Routes', () => {

  test('POST /pp/upload should upload a profile picture', async () => {
    const response = await request(app)
      .post('/image/pp/upload')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`) // Ajoutez l'en-tête d'autorisation
      .attach('image', path.resolve(__dirname, '../../App/assets/images/Arosaje.png')); // Ajoutez l'image

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("Image ajoutée avec succès");
  });

  test('GET /pp/:id should return a profile picture', async () => {
    const response = await request(app)
      .get('/image/pp/1') // Remplacez par l'ID de l'image
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Ajoutez d'autres assertions selon la structure de votre réponse
  });

  test('PUT /resetPP should reset the profile picture', async () => {
    const response = await request(app)
      .put('/image/resetPP')
      .set('Authorization', `1f2db30d-2485-4457-8029-1ba9ffd03627`); // Ajoutez l'en-tête d'autorisation

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.url).toBeDefined(); // Vérifiez que l'URL de l'image est définie
  });

  // Ajoutez d'autres tests pour les autres routes...
});
