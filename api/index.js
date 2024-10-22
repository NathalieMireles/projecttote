import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config();

const app = express()

mongoose.connect(process.env.url)
    .then(() => {
        console.log('jala')
    })
    .catch((err) => {
        console.log('no jala', err)
    })

app.use(cors())
app.use(helmet())

app.get("/", (req,res)=>{
    res.send("Hola desde mi servidor")
})

app.listen(4000,()=>console.log("Server is running"))