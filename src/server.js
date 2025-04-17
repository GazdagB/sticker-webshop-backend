import express from 'express';
import productsRouter from './routes/products.js';

const app = express(); 

app.use(express.json()); 

const PORT = process.env.APP_PORT || 8080; 

app.use("/products", productsRouter);

app.listen(PORT, ()=>{
    console.log(`Listening at port: ${PORT}`);
})

export default app; 