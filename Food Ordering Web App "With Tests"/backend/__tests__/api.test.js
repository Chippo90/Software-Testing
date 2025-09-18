const request = require('supertest');
const app = require('../index');

describe('User Story #1 - View Menu', () => {
    test('GET /api/menu returns items with required fields', async () => {
        const res = await request(app).get('/api/menu');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(5);
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('description');
        expect(res.body[0]).toHaveProperty('category');
        expect(res.body[0]).toHaveProperty('price');
    });
});

describe('User Story #6 - Place Order', () => {
    test('POST /api/orders creates a valid order', async () => {
        const res = await request(app).post('/api/orders').send({
            name: 'Alice',
            contact: 'alice@test.com',
            items: [{ id: 'm1', quantity: 2 }],
            promo: 'SAVE5'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('status', 'received');
    });
});

describe('User Story #7 - Get Order by ID', () => {
    let orderId;
    beforeAll(async () => {
        const res = await request(app).post('/api/orders').send({
            name: 'Bob',
            contact: 'bob@test.com',
            items: [{ id: 'm2', quantity: 1 }]
        });
        orderId = res.body.id;
    });

    test('GET /api/orders/:id returns correct order', async () => {
        const res = await request(app).get(`/api/orders/${orderId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', orderId);
    });
});

describe('User Story #8 - Admin View All Orders', () => {
    test('GET /api/orders returns a list of orders', async () => {
        const res = await request(app).get('/api/orders');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('User Story #9 - Admin Change Order Status', () => {
    let orderId;
    beforeAll(async () => {
        const res = await request(app).post('/api/orders').send({
            name: 'Charlie',
            contact: 'charlie@test.com',
            items: [{ id: 'm3', quantity: 1 }]
        });
        orderId = res.body.id;
    });

    test('PUT /api/orders/:id/status updates order status', async () => {
        const res = await request(app).put(`/api/orders/${orderId}/status`).send({ status: 'preparing' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'preparing');
    });
});
