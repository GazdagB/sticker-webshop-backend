import supertest from "supertest";
import app from '../server.js';

export const mockedProduct = {
  name: 'Test Product',
  price: 4.99,
  description: 'A test product for automated testing',
  image_url: 'https://picsum.photos/id/237/200/300',
  category_id: 1
};

export async function seedData(endpoint, customData = {}) {
  let testData = {};

  if(endpoint === "products"){
    testData = {...mockedProduct, ...customData }
  }
  const response = await supertest(app).post(`/${endpoint}`).send(testData);    
  return response;
}

export async function deleteData(id,endpoint) {
  return await supertest(app).delete(`/${endpoint}/${id}`);
}
