import supertest from "supertest";
import app from '../server.js';

export const mockedBody = {
  name: 'Test Product',
  price: 4.99,
  description: 'A test product for automated testing',
  image_url: 'https://picsum.photos/id/237/200/300',
  category_id: 1
};

export async function seedProduct(customData = {}) {
  const testData = { ...mockedBody, ...customData };
  const response = await supertest(app).post('/products').send(testData);    
  return response;
}

export async function deleteProduct(id) {
  return await supertest(app).delete(`/products/${id}`);
}