import db from "../db/index.js";

export async function getAllUsers() {
    const result = await db.query(`
        SELECT id, last_name, first_name, email 
        FROM users 
        WHERE is_deleted = false
    `);

    return result.rows;
}

export async function createUser(user) {
    const result = await db.query(
        `INSERT INTO users (username, first_name, last_name, email, password_hash) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, username, first_name, last_name, email`,
        [user.username, user.first_name, user.last_name, user.email, user.password]
    );
    return result.rows[0];
}

export async function getUserById(id) {
    const result = await db.query(
        `SELECT id, username, first_name, last_name, email 
         FROM users 
         WHERE id = $1 AND is_deleted = false`,
        [id]
    );
    return result.rows[0];
}

export async function updateUser(id, user) {
    const result = await db.query(
        `UPDATE users 
         SET username = $1, first_name = $2, last_name = $3, email = $4 
         WHERE id = $5 RETURNING id, username, first_name, last_name, email`,
        [user.username, user.first_name, user.last_name, user.email, id]
    );
    return result.rows[0];
}

export async function deleteUser(id) {
    const result = await db.query(
        `UPDATE users 
         SET is_deleted = true 
         WHERE id = $1 RETURNING id`,
        [id]
    );
    return result.rows[0];
}

export async function softDeleteUser(id) {
    const result = await db.query(
        `UPDATE users 
         SET is_deleted = true 
         WHERE id = $1 RETURNING id`,
        [id]
    );
    return result.rows[0];
}