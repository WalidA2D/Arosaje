import request from 'supertest';
import express from 'express';
import imageRouter from '../src/routes/imageRoutes';

const app = express();
app.use(express.json());
app.use('/image', imageRouter);

describe('Image Routes', () => {
  test('POST /pp/upload should upload a profile picture', async () => {
    const response = await request(app)
      .post('/image/pp/upload')
      .attach('image', 'path/to/image.jpg'); // Remplacez par un chemin valide
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
