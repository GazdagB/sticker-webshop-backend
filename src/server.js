import express from 'express';
import productsRouter from './routes/products.js';
import categoryRouter from "./routes/categories.js"
import usersRouter from "./routes/users.js";
import loginRouter from "./routes/login.js";

const app = express(); 

app.use(express.json()); 

const PORT = process.env.APP_PORT || 8080; 

app.use("/products", productsRouter);
app.use("/categories", categoryRouter )
app.use("/users", usersRouter);
app.use("/login", loginRouter);

app.listen(PORT, ()=>{
    console.log(`Listening at port: ${PORT}`);
})

export default app; 