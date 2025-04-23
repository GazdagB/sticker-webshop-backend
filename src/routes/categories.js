import express from "express"
import { getAllCategories } from "../services/categoryService.js";

const router = express.Router(); 

router.get('/', async (req,res)=>{
    try {
        const categories = await getAllCategories(); 
        
        res.json(categories); 
    } catch (error) {
        console.error('Error running query: ', error); 
        res.status(500).send('Database error');
    }
})

export default router;