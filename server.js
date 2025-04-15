const express = require('express');

const app = express(); 

const PORT = process.env.APP_PORT || 8080; 

app.listen(PORT, ()=>{
    console.log(`Listening at port: ${PORT}`);
})

app.get("/",(req,res)=>{
    res.status(200).json({message: "Hello,Webshop!"})
})