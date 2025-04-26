import db from "../db/index.js"; 

export async function getAllCategories(){
    const result = await db.query(`
        SELECT id, name, description FROM categories
        WHERE is_deleted = false
        ; 
        `)

        return result.rows
}

export async function getCategoryById(id){
    const result = await db.query(`
        SELECT id, name, description FROM categories
        WHERE id = $1 AND is_deleted = false
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

export async function updateCategory(id, body){
    const result = await db.query(`
        UPDATE categories SET name = $1, description = $2, updated_at = NOW()
        WHERE id = $3 RETURNING *;
        `, [body.name, body.description, id])

        return result.rows[0];
}

export async function softDeleteById(id){
    const result = await db.query(`
        UPDATE categories SET is_deleted = true        
        WHERE id = $1 RETURNING *;
        `, [id])  
        
        return result.rows[0];
}

export async function restoreById(id){
    const result = await db.query(`
        UPDATE categories SET is_deleted = false        
        WHERE id = $1 RETURNING *;
        `, [id])  
        
        return result.rows[0];
};

export async function deleteById(id){
    const result = await db.query(`
        DELETE FROM categories WHERE id = $1 RETURNING *;
        `, [id])

        return result.rows[0];
}