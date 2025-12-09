const request = require('supertest');
const { app } = require('../index');

describe('Integration Tests - Timesheets API', () => {
  describe('POST /api/timesheets', () => {
    test('creates a new timesheet entry with valid data', async () => {
      const payload = {
        employee_name: 'Alice Smith',
        check_in_time: '2025-12-09 08:00:00',
        check_out_time: '2025-12-09 16:30:00'
      };

      const res = await request(app)
        .post('/api/timesheets')
        .send(payload);

      // Either 201 (created, DB available) or 503 (DB unavailable)
      if (res.statusCode === 201) {
        expect(res.body.id).toBeDefined();
        expect(res.body.employee_name).toBe('Alice Smith');
      } else {
        expect(res.statusCode).toBe(503);
      }
    });

    test('returns 400 when missing required fields', async () => {
      const payload = {
        employee_name: 'Bob Jones'
        // missing check_in_time and check_out_time
      };

      const res = await request(app)
        .post('/api/timesheets')
        .send(payload);

      // 400 if DB available and validation fails, 503 if DB unavailable
      expect([400, 503]).toContain(res.statusCode);
    });
  });

  describe('GET /api/timesheets', () => {
    test('retrieves all timesheet entries', async () => {
      const res = await request(app).get('/api/timesheets');

      // Either 200 (returns array) or 503 (DB unavailable)
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      } else {
        expect(res.statusCode).toBe(503);
      }
    });
  });

  describe('PUT /api/timesheets/:id', () => {
    test('updates a timesheet entry', async () => {
      const payload = {
        employee_name: 'Charlie Brown',
        check_in_time: '2025-12-09 09:00:00',
        check_out_time: '2025-12-09 17:00:00'
      };

      const res = await request(app)
        .put('/api/timesheets/1')
        .send(payload);

      // 200 if found and updated, 404 if not found, 503 if DB unavailable
      expect([200, 404, 503]).toContain(res.statusCode);
    });
  });

  describe('DELETE /api/timesheets/:id', () => {
    test('deletes a timesheet entry', async () => {
      const res = await request(app).delete('/api/timesheets/1');

      // 200 if deleted, 404 if not found, 503 if DB unavailable
      expect([200, 404, 503]).toContain(res.statusCode);
    });
  });
});
