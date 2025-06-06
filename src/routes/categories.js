import express from "express"
import { getAllCategories, getCategoryById , createCategory, deleteById, updateCategory, softDeleteById, restoreById} from "../services/categoryService.js";
import { categoryValidationRules} from "../validators/categoryValidator.js";
import {validateId} from "../validators/productValidator.js";
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

router.patch('/:id/restore', validateId, async (req,res)=>{
    const id = req.params.id; 

    try {
        const result = await restoreById(id);
        if(!result){
            return res.status(404).json({message: "Couldn't find category"})
        }
        res.json({message: "Category restored successfully", id: result.id , data: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong"})
    }
});

router.patch('/:id/delete', validateId, async (req,res)=>{
    const id = req.params.id; 

    try {
        const result = await softDeleteById(id);
        if(!result){
            return res.status(404).json({message: "Couldn't find category"})
        }
        res.json({message: "Category deleted successfully", id: result.id , data: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong"})
    }
});



//TODO: Add update route
router.put('/:id', categoryValidationRules, validateId, validate, async (req,res)=>{
    const id = req.params.id; 

    try {
        const category = await updateCategory(id, req.body); 

        if(!category){
            return res.status(404).json({message: "Couldn't find category"})
        }

        res.json({message: "Category updated successfully", id: category.id , data: category}); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({message: "Something went wrong"})
    }
});

router.delete('/:id', async (req,res)=>{
    const id = req.params.id; 

    try {
        const category = await deleteById(id); 

        if(!category){
            return res.status(404).json({message: "Couldn't find category"})
        }

        res.json({message: "Category deleted successfully", id: category.id , data: category}); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({message: "Something went wrong"})
    }
});


export default router;