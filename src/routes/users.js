import express from 'express';
import { getAllUsers } from '../services/usersService.js';
import { userValidationRules } from '../validators/userValidator.js';
import { validate } from '../middlewares/validate.js';
import { validateId } from '../validators/productValidator.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.json(users);
    } catch (error) {
        console.error('Error running query: ', error);
        res.status(500).send('Database error');
    }
});

export default router;