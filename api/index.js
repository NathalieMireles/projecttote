import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userController from "./controllers/userController.js"

dotenv.config()

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
app.use(express.json())

app.get('/', (req, res) => {
    res.send("get wrkng :)")
})

app.post('/user/register', userController.register)
app.put('/user/update-profile/:id', userController.update)
app.post('/user/login', userController.login)

app.listen(4000, () => console.log(" :)"))