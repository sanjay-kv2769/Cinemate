// __tests__/authRoutes.test.js
const request = require('supertest');
const app = require('../app'); // Make sure to export your express app in your app.js or server.js

describe('Login Route Tests', () => {
  it('should return 400 if email or password is missing', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: '',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe('Email and password are required');
  });

  it('should return 400 if user does not exist', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'nonexistentuser@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe('User does not exist');
  });

  it('should return 400 if password is incorrect', async () => {
    // Assume user is already registered in your test database
    const response = await request(app).post('/api/auth/login').send({
      email: 'existinguser@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe('Incorrect password');
  });

  it('should return 200 and a token if login is successful', async () => {
    // Assume user is already registered in your test database
    const response = await request(app).post('/api/auth/login').send({
      email: 'sam@gmnail.com',
      password: 'test1234', // Use the correct password for the test user
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined(); // Ensure token is returned
  });
});
