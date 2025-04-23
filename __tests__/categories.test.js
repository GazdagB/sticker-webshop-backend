import app from "../src/server.js"; 
import supertest from "supertest";
import { deleteData, seedData } from "../src/utils/testUtils.js";

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