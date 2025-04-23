import express from "express"
import db from "../db/index.js"
import { productValidationRules, validateProductIdParam, productStockValidationRules} from '../validators/productValidator.js';
import { validate } from '../middlewares/validate.js';
import { getAllProducts, getAllSoftDeleted, getProductById, hardDelete, postProduct, restoreSoftDelete, softDelete, updateProduct, updateStock } from "../services/productService.js";

const router = express.Router();




router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts(); 

        if(!products){
            return res.status(404).json({message: "There aren't any products"})
        }
        res.json(products)
    } catch (error) {
        console.error("Error running query: ", error)
        res.status(500).send('Database error');
    }
});



router.get("/soft_deleted", async (req,res)=>{
    try {
        const products = await getAllSoftDeleted(); 

        if(!products){
            return res.status(404).json({message: "No deleted products yet"})
        }
        res.json(products); 
    } catch (error) {
        console.log(error); 
        res.status(500).json({message: "Database error"});
    }
})

router.get("/:id", validateProductIdParam, validate, async (req,res)=>{
    try{
        const product = await getProductById(req.params.id)

            if(!product){
                return res.status(404).json({message: "Prdocut not found"})
            }

        res.json(product); 
    } catch(error){
        console.log("Error running query: ", error); 
        res.status(500).send('Database error'); 
    }
})

router.put("/:id/restore", validateProductIdParam, validate, async(req,res)=>{
    const {id} = req.params;
    console.log("Restore route hit with ID:", req.params.id);
    try {
        const product = await restoreSoftDelete(id); 

        if(!product){
            return res.status(404).json({message: 'Product not found!'})
        }
    res.json({message: 'Soft Delete Restored', product: product})
    } catch (error) {
        console.error('Error restoring soft deleted product:', error);
        res.status(500).json({error: 'Internal server error'})
    }
})

router.post("/", productValidationRules, validate,  async (req, res) => {
    try {
        const product = await postProduct(req.body)
        res.status(201).json(product)
        
    } catch (error) {
        console.error("Error running query: ", error)
        res.status(500).send('Database error');
    }
})



router.put("/:id", validateProductIdParam, validate, async (req,res)=>{
    try {
        const product = await updateProduct(req.pramas.id, req.body)

        if (!product){
            return res.status(404).json({message: "Product not found"}); 
        }

        res.json(product)
    } catch (error) {
        console.error("Error updating product: ", error); 
        res.status(500).send("Database Error")
    }
})

router.put("/:id/delete", validateProductIdParam, validate, async (req, res) => {
    try {
        
        const product = await softDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product soft-deleted", product: product });
    } catch (error) {
        console.error("Soft delete error:", error);
        res.status(500).send("Database error");
    }
});

router.delete("/:id", validateProductIdParam, validate, async (req,res)=>{
    try {
        
        const product = await hardDelete(req.params.id); 

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(204).json({ message: "Product hard-deleted", product: product });
    } catch (error) {
        console.error("Hard delete error:", error);
        res.status(500).send("Database error");
    }
})

router.patch("/:id/stock",validateProductIdParam, productStockValidationRules, validate, async (req,res)=>{
    const {id} = req.params; 
    const {stock} = req.body; 
    
    try {
            const product = await updateStock(id,stock)

            if(!product){
                return res.status(404).json({message: "Product not found!"})
            }
        res.json({message: 'Stock updated',product: product})
    } catch (error) {
        console.error('Error updating stock:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default router;