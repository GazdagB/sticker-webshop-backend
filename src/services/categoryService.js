import db from "../db/index.js"; 

export async function getAllCategories(){
    const result = await db.query(`
        SELECT id, name, description FROM categories; 
        `)

        return result.rows
}