import connection from "./db/connect.js";
import dotenv from 'dotenv'
import app from "./app.js";
dotenv.config({
path:'./.env'
})  

console.log("HELLO IT PROJECTT")
connection().
then(()=>{
    app.on("error",(error)=>{
            console.log("error in connecting")  
            throw error
        })
    app.listen(process.env.PORT,()=>{
        console.log("APP WORKING ON PORT ",`${process.env.PORT}`,"http://localhost:"+`${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error occured while connecting",err)
})