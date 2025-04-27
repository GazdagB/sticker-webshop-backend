import app from "../src/server.js"; 
import supertest from "supertest";
import { deleteData, seedData } from "../src/utils/testUtils.js";

const createdUserIds = [];

afterAll(async ()=>{
    for(const id of createdUserIds){
        try {
            await deleteData(id, "users");
        } catch (error) {
            console.log(`Could not delete user ${id}:`, error.message);
        }
    }
})

describe('GET /users', () => { 
    test('Should return an array of users with valid structure', async () => {
        const res = await supertest(app).get('/users'); 

        expect(res.status).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true); 
        expect(res.body.length).toBeGreaterThan(0); 
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name'); 
        expect(res.body[0]).toHaveProperty('email'); 
    })
 })