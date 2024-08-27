import request from 'supertest';
import express from 'express';
import postRouter from '../src/routes/postRoutes';
import path from 'path'; // Importez le module path

const app = express();
app.use(express.json());
app.use('/post', postRouter);

describe('Post Routes', () => {
  test('POST /create should create a post', async () => {
    const response = await request(app)
      .post('/post/create')
      .set('Authorization', '1f2db30d-2485-4457-8029-1ba9ffd03627') // Ajoutez l'en-tête d'autorisation
      .field('title', 'Test Post') // Ajoutez le champ title
      .field('description', 'This is a test post.') // Ajoutez le champ description
      .field('publishedAt', new Date().toISOString())
      .field('dateStart', new Date().toISOString())
      .field('dateEnd', new Date().toISOString())
      .field('address', '123 Test St')
      .field('cityName', 'Test City')
      .field('state', 'true')
      .field('accepted', 'false')
      .field('plantOrigin', 'Test Origin')
      .field('plantRequirements', 'Test Requirements')
      .field('plantType', 'Test Type')
      .attach('images', path.resolve(__dirname, '../../App/assets/images/Arosaje.png')); // Ajoutez l'image

    expect(response.status).toBe(200);
  });

  test('GET /read should return posts', async () => {
    const response = await request(app)
      .get('/post/read')
      .set('Authorization', '1f2db30d-2485-4457-8029-1ba9ffd03627'); // Ajoutez l'en-tête d'autorisation
    expect(response.status).toBe(200);
  });

  // Ajoutez d'autres tests pour les autres routes...
});
