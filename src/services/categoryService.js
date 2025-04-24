import db from "../db/index.js"; 

export async function getAllCategories(){
    const result = await db.query(`
        SELECT id, name, description FROM categories; 
        `)

        return result.rows
}

export async function getCategoryById(id){
    const result = await db.query(`
        SELECT id, name, description FROM categories
        WHERE id = $1
        `, [id])

        return result.rows[0];
}

export async function createCategory(body){
    const result = await db.query(`
        INSERT INTO categories (name, description)
        VALUES ($1, $2) RETURNING *
        `, [body.name, body.description])

        return result.rows[0];
}

