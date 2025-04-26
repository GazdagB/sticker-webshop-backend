import app from "../src/server.js"; 
import supertest from "supertest";
import { deleteData, mockedCategory, seedData } from "../src/utils/testUtils.js";

const createdCategoryIds = [];

afterAll(async ()=>{

    for(const id of createdCategoryIds){
        try {
            await deleteData(id, "categories");
        } catch (error) {
            console.log(`Could not delete category ${id}:`, error.message);
        }
    }
})

describe('GET /categories', ()=>{
    test('Should return an array of categories with valid structure', async ()=>{
      
        const res = await supertest(app).get('/categories'); 

        expect(res.status).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true); 
        expect(res.body.length).toBeGreaterThan(0); 
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name'); 
        expect(res.body[0]).toHaveProperty('description'); 
    })
})

describe("GET /categories/:id", ()=>{
    test('Should return the right category', async ()=>{
        const seededCategory = await seedData("categories");
        createdCategoryIds.push(seededCategory.body.id)

        const res = await supertest(app).get(`/categories/2`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 2 );
        expect(res.body).toHaveProperty('name')
    })

    test('should return 404 for non-existent category', async ()=>{
        const res = await supertest(app).get('/categories/9999'); 
        expect(res.status).toBe(404); 
        expect(res.body).toHaveProperty('message')
    })
})

describe("POST /categories", ()=>{
    test('Should create a category and return the created body', async ()=>{
        const res = await supertest(app).post('/categories').send(mockedCategory)
        
        createdCategoryIds.push(res.body.id); 

        expect(res.status).toBe(201); 
        expect(res.body).toHaveProperty('id', res.body.id );
        expect(res.body).toHaveProperty('name')
    })
})

//TODO: Add update test
describe('PUT /categories/:id', () => {
    test('Should update the correct category', async () => {
        const seededCategory = await seedData('categories'); 
        createdCategoryIds.push(seededCategory.body.id); 

        const updatedData = {
            name: 'Updated Category',
            description: 'Updated description'
        };

        const res = await supertest(app).put(`/categories/${seededCategory.body.id}`).send(updatedData); 

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', seededCategory.body.id);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message', 'Category updated successfully');
    });

    test('Should return 404 for non-existent category', async () => {
        const res = await supertest(app).put('/categories/9999').send({ name: 'Non-existent', description: 'This category does not exist' }); 

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', "Couldn't find category");
    })

    test('Should return 400 for invalid data', async () => {
        const seededCategory = await seedData('categories'); 
        createdCategoryIds.push(seededCategory.body.id); 

        const res = await supertest(app).put(`/categories/${seededCategory.body.id}`).send({}); 

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    })
})

describe('PATCH /categories/:id/delete', ()=>{
    test('Soft Deletes the correct category', async ()=>{
        const seededCategory = await seedData('categories'); 
        createdCategoryIds.push(seededCategory.body.id); 

        const res = await supertest(app).patch(`/categories/${seededCategory.body.id}/delete`); 

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Category deleted successfully');
        expect(res.body).toHaveProperty('id', seededCategory.body.id);

        const getRes = await supertest(app).get(`/categories/${seededCategory.body.id}`);
        expect(getRes.status).toBe(404);
    })
    test('Should return 404 for non-existent category', async () => {
        const res = await supertest(app).patch('/categories/9999/delete'); 

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', "Couldn't find category");
    })
})
describe('DELETE /categories/:id', () => { 
    test('Should delete the correct category', async ()=>{
        const seededCategory = await seedData('categories'); 
        createdCategoryIds.push(seededCategory.body.id); 

        const res = await supertest(app).delete(`/categories/${seededCategory.body.id}`); 

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Category deleted successfully');
        expect(res.body).toHaveProperty('id', seededCategory.body.id);

        const getRes = await supertest(app).get(`/categories/${seededCategory.body.id}`);
        expect(getRes.status).toBe(404);

    })
 })