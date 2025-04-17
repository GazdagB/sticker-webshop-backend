import app from '../src/server.js'; 
import supertest from 'supertest'; 

describe('GET /products', () => {
  test('It should return a list of products', async () => {
    const response = await supertest(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
    expect(response.body.length).toBeGreaterThan(0); // Ensure we have at least one product
  });
});

describe('GET /products/:id', () => {
    test('It should return a product by ID', async () => {
      const productId = 3; // Use an ID that exists in your DB for testing
      const response = await supertest(app).get(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('image_url');
    });
  
    test('It should return 404 for a non-existing product', async () => {
      const nonExistingId = 9999; // Use an ID that doesn't exist
      const response = await supertest(app).get(`/products/${nonExistingId}`);
      expect(response.status).toBe(404);
    });
  });