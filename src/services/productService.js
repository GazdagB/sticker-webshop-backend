import db from "../db/index.js"

export async function getAllProducts(){
    const result = await db.query(`
        SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.is_deleted = false
    `);

    return result.rows;
}

export async function getProductById(id){
    const result = await db.query(`
        SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock, c.name AS category_name 
        FROM products p
        JOIN categories c ON p.category_id =  c.id
        WHERE p.id = $1 AND p.is_deleted = false
        `, [id])

        return result.rows[0]; 
}

export async function getAllSoftDeleted(){
    const result = await db.query(`
        SELECT p.id, p.name, p.is_deleted
        FROM products p
        WHERE p.is_deleted = true
        `)

        return result.rows; 
}

export async function postProduct(body){
    const { name, description, price, image_url, category_id } = body;
    const result = await db.query(
        `INSERT INTO products (name, description, price, image_url, category_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, price, image_url, category_id]
    )

    return result.rows[0]
}

export async function updateProduct(id, body){
    const { name, description, price, image_url, category_id } = body;
    const result = await db.query(
                `
                UPDATE products 
                SET 
                    name = $1,
                    description = $2,
                    price = $3,
                    image_url = $4,
                    category_id = $5
                WHERE id = $6 
                RETURNING *; 
                `
                , [name,description,price,image_url,category_id,req.params.id]
            )

    return result.rows[0]
}

export async function softDelete(id){

    const result = await db.query(
        `UPDATE products SET is_deleted = true WHERE id = $1 RETURNING *`,
        [id]
    );

    return result.rows[0]
}

export async function hardDelete(id){
    const result = await db.query(
        `DELETE FROM products WHERE id = $1 RETURNING *`,
        [id]
    )

    return result; 
}

export async function updateStock(id,stock){
    const result = await db.query(
        `
        UPDATE products SET stock = $1 WHERE id = $2 RETURNING * 
        `, [stock,id])

    return result.rows[0]; 
}