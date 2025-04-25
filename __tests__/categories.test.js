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
        console.log(res);
        
        createdCategoryIds.push(res.body.id); 

        expect(res.status).toBe(201); 
        expect(res.body).toHaveProperty('id', res.body.id );
        expect(res.body).toHaveProperty('name')
    })
})

//TODO: Add delete and update test 