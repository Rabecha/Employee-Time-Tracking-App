const request = require('supertest');
const { app } = require('../index');

describe('Unit Tests - Server Endpoints', () => {
  test('GET /health returns 200 with status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET / serves index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /invalid returns 404', async () => {
    const res = await request(app).get('/api/invalid');
    expect(res.statusCode).toBe(404);
  });
});
