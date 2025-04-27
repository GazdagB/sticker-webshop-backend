import db from "../db/index.js";

export async function getAllUsers() {
    const result = await db.query(`
        SELECT id, first_name, last_name, email, 
        FROM users
        WHERE is_deleted = false
    `);

    return result.rows;
}