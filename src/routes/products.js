import express from "express"
import db from "../db/index.js"

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

router.get("/:id", async (req,res)=>{
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

router.post("/", async (req, res) => {
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


export default router;