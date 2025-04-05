import dotenv from 'dotenv'
dotenv.config()  
import connection from "./db/connect.js";

import app from "./app.js";

console.log("HELLO IT PROJECTT")
connection().
then(()=>{
    app.on("error",(error)=>{
            console.log("error in connecting")  
            throw error
        })
    app.listen(process.env.PORT,()=>{
        console.log("APP WORKING ON PORT ",`${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error occured while connecting",err)
})