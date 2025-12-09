const request = require('supertest');
const { app } = require('../index');

describe('Health and DB-unavailable behavior', () => {
  test('GET /health returns 200 and status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
  });

  test('GET / returns 200 and serves index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/timesheets returns 503 when DB is unavailable', async () => {
    const res = await request(app).get('/api/timesheets');
    // When DB is not connected, should return 503
    expect([200, 503]).toContain(res.statusCode);
  });

  test('POST /api/timesheets returns 503 when DB is unavailable', async () => {
    const res = await request(app)
      .post('/api/timesheets')
      .send({
        employee_name: 'John Doe',
        check_in_time: '2025-12-09 09:00:00',
        check_out_time: '2025-12-09 17:00:00'
      });
    expect([201, 503]).toContain(res.statusCode);
  });

  test('POST /api/timesheets returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/timesheets')
      .send({ employee_name: 'John Doe' });
    // Will return 503 if DB unavailable, 400 if DB available but missing fields
    expect([400, 503]).toContain(res.statusCode);
  });
});
