import express from 'express';
import db from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import e from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "Username/email and password are required" });
    }
  
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username || email, email || username] // fallback
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid username or email" });
      }
  
      const user = result.rows[0];
  
      if (!user.password_hash) {
        return res.status(500).json({ message: "No password hash found for this user" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
  
    } catch (error) {
      console.error('Error running query: ', error);
      res.status(500).send('Database error');
    }
  });

export default router;