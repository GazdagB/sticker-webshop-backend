import db from "../db/index.js";

export async function getAllUsers() {
    const result = await db.query(`
        SELECT last_name, first_name, email 
        FROM users 
        WHERE is_deleted = false
    `);

    return result.rows;
}