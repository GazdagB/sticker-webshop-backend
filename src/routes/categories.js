import express from "express"
import { getAllCategories, getCategoryById , createCategory} from "../services/categoryService.js";
import { categoryValidationRules } from "../validators/categoryValidator.js";
import { validate } from "../middlewares/validate.js";

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

router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    
    try {
        const category = await getCategoryById(id);  


        if(!category){
             res.status(404).json({message: "Couldn't find category"})
        }

        res.json(category); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({message: "Something went wrong"})
    }
})

router.post('/', categoryValidationRules, validate,  async (req,res)=>{
    try {
        const category = await createCategory(req.body);
        res.status(201).json(category)
    } catch (error) {
        console.error("Error running query: ", error)
        res.status(500).send('Database error');
    }
})

export default router;