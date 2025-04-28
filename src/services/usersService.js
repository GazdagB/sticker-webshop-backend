import db from "../db/index.js";

export async function getAllUsers() {
    const result = await db.query(`
        SELECT last_name, first_name, email 
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