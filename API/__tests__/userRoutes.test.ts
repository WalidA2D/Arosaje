import request from 'supertest';
import express from 'express';
import userRouter from '../src/routes/userRoutes';
import { UserInstance } from '../src/models/User';
import { jest } from '@jest/globals';
import { Op } from 'sequelize';

jest.mock('../src/models/User');
const mockUser = UserInstance as jest.Mocked<typeof UserInstance>;

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /user/create should create a user', async () => {
    const userData = {
      idUsers: 1,
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@example.com',
      address: '123 Main St',
      phone: '1234567890',
      cityName: 'Anytown',
      password: 'hashedpassword',
      photo: 'photo.jpg',
      isBotanist: false,
      isAdmin: false,
      isBan: false,
      note: 4.5,
      uid: 'validtoken'
    };

    mockUser.create.mockResolvedValue(userData as any);

    const response = await request(app)
      .post('/user/create')
      .send({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        address: '123 Main St',
        phone: '1234567890',
        cityName: 'Anytown',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('idUsers');
  });

  test('GET /user/profil should return user profile', async () => {
    const userData = {
      idUsers: 1,
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@example.com',
      address: '123 Main St',
      phone: '1234567890',
      cityName: 'Anytown',
      password: 'hashedpassword',
      photo: 'photo.jpg',
      isBotanist: false,
      isAdmin: false,
      isBan: false,
      note: 4.5,
      uid: 'validtoken'
    };

    mockUser.findOne.mockResolvedValue(userData as any);

    const response = await request(app)
      .get('/user/profil')
      .set('Authorization', 'Bearer validtoken');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('lastName', 'Doe');
    expect(response.body).toHaveProperty('firstName', 'John');
    expect(response.body).toHaveProperty('email', 'john.doe@example.com');
  });

  test('GET /user/read should return a list of users with pagination', async () => {
    const userList = [
      {
        idUsers: 1,
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        address: '123 Main St',
        phone: '1234567890',
        cityName: 'Anytown',
        password: 'hashedpassword',
        photo: 'photo.jpg',
        isBotanist: false,
        isAdmin: false,
        isBan: false,
        note: 4.5,
        uid: 'validtoken'
      },
      {
        idUsers: 2,
        lastName: 'Smith',
        firstName: 'Jane',
        email: 'jane.smith@example.com',
        address: '456 Main St',
        phone: '0987654321',
        cityName: 'Othertown',
        password: 'hashedpassword',
        photo: 'photo.jpg',
        isBotanist: false,
        isAdmin: false,
        isBan: false,
        note: 3.5,
        uid: 'validtoken2'
      }
    ];

    mockUser.findAll.mockResolvedValue(userList as any);

    const response = await request(app)
      .get('/user/read?limit=5&offset=0');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('lastName', 'Doe');
  });

  test('GET /user/read/:id should return user by ID', async () => {
    const userData = {
      idUsers: 1,
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@example.com',
      address: '123 Main St',
      phone: '1234567890',
      cityName: 'Anytown',
      password: 'hashedpassword',
      photo: 'photo.jpg',
      isBotanist: false,
      isAdmin: false,
      isBan: false,
      note: 4.5,
      uid: 'validtoken'
    };

    mockUser.findOne.mockResolvedValue(userData as any);

    const response = await request(app)
      .get('/user/read/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('lastName', 'Doe');
    expect(response.body).toHaveProperty('firstName', 'John');
  });

  test('PUT /user/update should update a user', async () => {
    mockUser.update.mockResolvedValue([1]);

    const response = await request(app)
      .put('/user/update')
      .set('Authorization', 'Bearer validtoken')
      .send({
        lastName: 'Doe Updated',
        firstName: 'John Updated',
        email: 'john.doe.updated@example.com',
        address: '456 Updated St',
        phone: '0987654321',
        cityName: 'Updatedtown',
        password: 'newpassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  test('DELETE /user/delete/:id should delete a user', async () => {
    mockUser.destroy.mockResolvedValue(1);

    const response = await request(app)
      .delete('/user/delete/1')
      .set('Authorization', 'Bearer validtoken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  test('POST /user/login should return token on successful login', async () => {
    mockUser.findOne.mockResolvedValue({
      idUsers: 1,
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      uid: 'validtoken'
    } as any);

    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'validtoken');
  });
});
