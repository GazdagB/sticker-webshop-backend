import { response } from 'express';
import app from '../src/server.js'; 
import supertest from 'supertest'; 


const mockedBody = {
  name: 'Funny Cat Sticker',
  price: 4.99,
  description: 'A quirky cat sticker for your laptop',
  image_url : "https://picsum.photos/id/237/200/300",
  category_id: 1
}

describe('GET /products', () => {
  test('It should return a list of products', async () => {
    const response = await supertest(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
    expect(response.body.length).toBeGreaterThan(0); // Ensure we have at least one product
  });

  test('It should have the defined structure', async ()=>{
    const response = await supertest(app).get("/products"); 
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('price');
    expect(response.body[0]).toHaveProperty('image_url');
    expect(response.body[0]).toHaveProperty('category_name'); 
    
  })
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


describe('POST /products/:id', ()=>{


  test('It returns a body with an ID', async ()=>{
    const response = await supertest(app).post('/products').send(mockedBody);

    expect(response.body).toHaveProperty('id')

    const createdProductId = response.body.id;


    await supertest(app).delete(`/products/${createdProductId}`);
  })

  test('It creates a new product', async ()=>{
   

    const response = await supertest(app).post('/products').send(mockedBody).set('Contet-Type', 'application/json').set('Accept', 'application/json')

    expect(response.status).toBe(201);

    const createdProductId = response.body.id;
    await supertest(app).delete(`/products/${createdProductId}`);
  })

  test('it should return 400 if required fields are missing', async ()=>{
    const badBody = {name: 'No Price Sticker',};
  
    const response = await supertest(app).post('/products').send(badBody); 
  
    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty('errors'); 
  })
})



describe('DELETE Hard /products/:id', ()=>{
  test('It delets a product by ID', async ()=>{
    const createRes = await supertest(app).post('/products').send(mockedBody); 
    const createdId = createRes.body.id; 

    const deleteRes = await supertest(app).delete(`/products/${createdId}`);
    expect(deleteRes.status).toBe(204); 

    const getRes = await supertest(app).get(`/producst/${createdId}`);
    expect(getRes.status).toBe(404); 
  })
})

describe('PUT (SOFT DELETE) /products/delete/:id', () => {
  test('It adds an is_deleted property with true to a product', async () => {
    const createdRes = await supertest(app).post('/products').send(mockedBody);
    const createdId = createdRes.body.id;

    const deleteRes = await supertest(app)
      .put(`/products/${createdId}/delete/`)
      .send(); 

    expect(deleteRes.body).toHaveProperty('message');
    expect(deleteRes.body).toHaveProperty('product');
    expect(deleteRes.body.product.is_deleted).toBe(true);

    const getRes = await supertest(app).get(`/products/${createdId}`);
    expect(getRes.status).toBe(200);
 
    // Cleanup (optional if soft delete just flags it)
    await supertest(app).delete(`/products/${createdId}`);
  });
});