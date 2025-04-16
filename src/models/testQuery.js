const db = require("../db/index");

db.query('SELECT NOW()', (err,res)=>{
    if(err){
        console.error('Database error:', err); 
    } else{
        console.log("Database time is: ", res.rows[0]); 
    }
})