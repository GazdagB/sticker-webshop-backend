import db from "../db/index.js";
import bcrypt from "bcrypt";

export async function loginUser(usernameOrEmail, password) {
    const result = await db.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [usernameOrEmail, usernameOrEmail]
    );

    if (result.rows.length === 0) {
        return null; 
    }

    const user = result.rows[0];

    if (!user.password_hash) {
        return null; 
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        return null; 
    }

    return user; 

}