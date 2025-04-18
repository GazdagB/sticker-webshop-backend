import express from "express"
import db from "../db/index.js"
import { productValidationRules, validateProductIdParam } from '../validators/productValidator.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id, p.name, p.description, p.price, p.image_url, c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
        `)
        res.json(result.rows)
    } catch (error) {
        console.error("Error running query: ", error)
        res.status(500).send('Database error');
    }
});

router.get("/:id", validateProductIdParam, validate, async (req,res)=>{
    try{
        const result = await db.query(`
            SELECT p.id, p.name, p.description, p.price, p.image_url, c.name AS category_name 
            FROM products p
            JOIN categories c ON p.category_id =  c.id
            WHERE p.id = $1
            `, [req.params.id])



            if(result.rows.length === 0){
                return res.status(404).json({message: "Prdocut not found"})
            }
        res.json(result.rows[0]); 
    } catch(error){
        console.log("Error running query: ", error); 
        res.status(500).send('Database error'); 
    }
})

router.post("/", productValidationRules, validate,  async (req, res) => {
    try {
        const { name, description, price, image_url, category_id } = req.body;
        const result = await db.query(
            `INSERT INTO products (name, description, price, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, description, price, image_url, category_id]
        )
        res.status(201).json(result.rows[0])
        
    } catch (error) {
        console.error("Error running query: ", error)
        res.status(500).send('Database error');
    }
})

router.put("/:id", validateProductIdParam, validate, async (req,res)=>{
    const { name, description, price, image_url, category_id } = req.body;

    try {
        const result = await db.query(
            `
            UPDATE products 
            SET 
                name = $1,
                description = $2,
                price = $3,
                image_url = $4,
                category_id = $5
            WHERE id = $6 
            RETURNING *; 
            `
            , [name,description,price,image_url,category_id,req.params.id]
        )

        if (result.rows.length === 0){
            return res.status(404).json({message: "Product not found"}); 
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error("Error updating product: ", error); 
        res.status(500).send("Database Error")
    }
})

router.put("/:id/delete", validateProductIdParam, validate, async (req, res) => {
    try {
        const result = await db.query(
            `UPDATE products SET is_deleted = true WHERE id = $1 RETURNING *`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product soft-deleted", product: result.rows[0] });
    } catch (error) {
        console.error("Soft delete error:", error);
        res.status(500).send("Database error");
    }
});

router.delete("/:id", validateProductIdParam, validate, async (req,res)=>{
    try {
        const result = await db.query(
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(204).json({ message: "Product hard-deleted", product: result.rows[0] });
    } catch (error) {
        console.error("Hard delete error:", error);
        res.status(500).send("Database error");
    }
})


export default router;