import app from '../src/server.js'; 
import supertest from 'supertest'; 
import { seedProduct, deleteProduct, mockedBody } from '../src/utils/testUtils.js';

// Helper to ensure cleanup even if tests fail
const createdProductIds = [];
afterAll(async () => {
  // Clean up any products created during tests
  for (const id of createdProductIds) {
    try {
      await deleteProduct(id);
    } catch (err) {
      console.log(`Could not delete product ${id}:`, err.message);
    }
  }
});


describe('GET /products', () => {
  test('It should return a list of products', async () => {
    const seedRes = await seedProduct();
    createdProductIds.push(seedRes.body.id);
    const response = await supertest(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
    expect(response.body.length).toBeGreaterThan(0); // Ensure we have at least one product

    
  });

  test('It should have the defined structure', async () => {
    const response = await supertest(app).get("/products"); 
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('price');
    expect(response.body[0]).toHaveProperty('image_url');
    expect(response.body[0]).toHaveProperty('category_name'); 
  });
});

describe('GET /products/:id', () => {
  test('It should return a product by ID', async () => {
    const seedRes = await seedProduct(); 
    createdProductIds.push(seedRes.body.id);
    const response = await supertest(app).get(`/products/${seedRes.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', response.body.id);
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

describe('POST /products', () => { // Fixed endpoint name from /products/:id to /products
  test('It returns a body with an ID', async () => {
    const response = await seedProduct();
    createdProductIds.push(response.body.id);
    expect(response.body).toHaveProperty('id');
  });

  test('It creates a new product', async () => {
    const response = await seedProduct(); 
    createdProductIds.push(response.body.id);
    expect(response.status).toBe(201);
  });

  test('it should return 400 if required fields are missing', async () => {
    const badBody = { name: 'No Price Sticker' };
    const response = await supertest(app).post('/products').send(badBody); 
    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty('errors'); 
  });
});

describe('DELETE Hard /products/:id', () => {
  test('It deletes a product by ID', async () => {
    // Create a product to delete
    const createRes = await seedProduct(); 
    const createdId = createRes.body.id; 
    createdProductIds.push(createdId)

    // Delete the product
    const deleteRes = await supertest(app).delete(`/products/${createdId}`);
    expect(deleteRes.status).toBe(204); 

    // Verify it's gone
    const getRes = await supertest(app).get(`/products/${createdId}`); // Fixed typo: producst -> products
    expect(getRes.status).toBe(404); 
  });
});

describe('PUT (SOFT DELETE) /products/:id/delete', () => {
  test('It adds an is_deleted property with true to a product', async () => {
    // Create a product to soft delete
    const createRes = await seedProduct();
    const createdId = createRes.body.id;
    createdProductIds.push(createdId); // Track for cleanup

    // Soft delete the product
    const deleteRes = await supertest(app)
      .put(`/products/${createdId}/delete`)
      .send(); 

    expect(deleteRes.body).toHaveProperty('message');
    expect(deleteRes.body).toHaveProperty('product');
    expect(deleteRes.body.product.is_deleted).toBe(true);

    // Verify it's not accessible with get
    const getRes = await supertest(app).get(`/products/${createdId}`);
    expect(getRes.status).toBe(404);
    
    // Check that it doesn't appear in the main listing
    const listRes = await supertest(app).get('/products');
    const deletedProduct = listRes.body.find(p => p.id === createdId);
    expect(deletedProduct).toBeUndefined();
  });
});

describe('PATCH /products/:id/stock', () => {
  test('Has valid endpoint', async () => {
    const postRes = await seedProduct(); 
    createdProductIds.push(postRes.body.id); // Track for cleanup

    const response = await supertest(app)
      .patch(`/products/${postRes.body.id}/stock`) // Fixed endpoint path
      .send({ stock: 20 });

    expect(response.status).not.toBe(404); 
  });

  test('It should update the stock value', async () => {
    const response = await seedProduct();
    createdProductIds.push(response.body.id)

    await supertest(app)
      .patch(`/products/${response.body.id}/stock`)
      .send({ stock: 20 }); 

    const getRes = await supertest(app).get(`/products/${response.body.id}`);
    expect(getRes.body.stock).toBe(20);

    
  });

  test("Should return 400 if body.stock is missing", async ()=>{
    const product = await seedProduct();
    createdProductIds.push(product.body.id)

    const res = await supertest(app).patch(`/products/${product.body.id}/stock`).send({}); 

    expect(res.status).toBe(400); 
    expect(res.body).toHaveProperty('errors'); 

    
  })

  test("Should return 400 if stock is NaN", async ()=>{
    const product = await seedProduct(); 
    createdProductIds.push(product.body.id)

    const res = await supertest(app).patch(`/products/${product.body.id}/stock`).send({stock: "twenty"}); 

    expect(res.status).toBe(400); 
    expect(res.body).toHaveProperty('errors');

    
  })

  test("Should return 404 if product does not exist", async ()=> {
    const res = await supertest(app).patch(`/products/99999/stock`).send({stock: 10})

    expect(res.status).toBe(404); 
  })

  test("Should return the updated product object", async ()=> {
    const product = await seedProduct(); 
    createdProductIds.push(product.body.id); 

    const res = await supertest(app).patch(`/products/${product.body.id}/stock`).send({stock: 20});

    expect(res.body.product).toHaveProperty('stock', 20);

  
  })
});

describe("GET /products/soft_deleted", ()=>{
  test('returns all the products with soft deleted propertis', async ()=>{
    const product = await seedProduct();
    createdProductIds.push(product.body.id); 

    await supertest(app).put(`/products/${product.body.id}/delete`);

    const getSofRes = await supertest(app).get("/products/soft_deleted"); 

    expect(getSofRes.body[0]).toHaveProperty("is_deleted", true);
  })
})

describe("PUT /products/:id/restore", ()=>{
  test('Restores a soft-deleted products', async ()=>{
    const created = await seedProduct(); 
    const id = created.body.id; 
    createdProductIds.push(id); 

    await supertest(app).put(`/products/${id}/delete`); 

    const restoreRes = await supertest(app).put(`/products/${id}/restore`);
    expect(restoreRes.status).toBe(200); 
    expect(restoreRes.body).toHaveProperty('message'); 
  })

  test("Returns 404 for non-existing or not-deleted product", async ()=>{
    const res = await supertest(app).put(`/products/9999/restore`); 
    expect(res.status).toBe(404)
  })
})