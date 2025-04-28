import express from 'express';
import { createUser, getAllUsers, getUserById, deleteUser,softDeleteUser, updateUser } from '../services/usersService.js';
import { userValidationRules } from '../validators/userValidator.js';
import { validate } from '../middlewares/validate.js';
import bcrypt from 'bcrypt';

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

router.post('/', userValidationRules, validate, async (req,res) =>{
    try {
        const {first_name, last_name, username, email, password} = req.body; 
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword
        };

        const result = await createUser(newUser);
        
        if (!result) {
            return res.status(400).json({ message: "User creation failed" });
        }
        res.status(201).json({ message: "User created successfully", user: result });

    } catch (error) {
        console.error('Error running query: ', error);
        if(error.constraint === 'users_username_key') {
            return res.status(409).json({ message: "Username already exists" });
        } else if(error.constraint === 'unique_email') {
            return res.status(409).json({ message: "Email already exists" });
        } else if(error.code === '23505') {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        res.status(500).send('Database error');
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error('Error running query: ', error);
        res.status(500).send('Database error');
    }
});

//TODO: Add validation for updateUser
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, username, email } = req.body;
    try {
        const updatedUser = await updateUser(id, { first_name, last_name, username, email });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error('Error running query: ', error);
        res.status(500).send('Database error');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error running query: ', error);
        res.status(500).send('Database error');
    }
});

router.patch('/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await softDeleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error running query: ', error);
        res.status(500).send('Database error');
    }
});


export default router;