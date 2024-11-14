import { UserModel } from "../models/UsersModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default {
    register: async (req, res) => {
        try {

            const hash = await bcrypt.hash(req.body.password, 10)
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                curp: req.body.curp,
                role: req.body.role,
            }

            await UserModel.create(user)
            res.status(200).json({ "status": "todo bien" })

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    },
    login: async (req, res) => {
        try {

            const email = req.body.email
            const password = req.body.password

            if (!email || !password) return res.status(400).json({ "status": "apuntele bien" })

            const user = await UserModel.findOne({ email })

            if (!user) return res.status(404).json({ "status": "no existes" })

            if (!bcrypt.compare(password, user.password)) return res.status(400).json({ "status": "no existes" })

            // crear tokens
            // se necesitaba cargar la informacion con una estructura menos compleja en el objeto
            const load = { id: user.id, email: user.email }
            // el token se devuelve con la informacion del id y del email del usuario
            const token = await jwt.sign(load, process.env.private_key)
            return res.status(200).json({ token })

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    },
    update: async (req, res) => {
        try {

            const user = await UserModel.findById(req.params.id)

            if (!user) return res.status(400).json({ "status": "usuario no encontrado" })

            user.name = req.body.name ? req.body.name : user.name
            user.email = req.body.email ? req.body.email : user.email
            user.curp = req.body.curp ? req.body.curp : user.curp
            user.role = req.body.role ? req.body.role : user.role
            // const hash = await bcrypt.hash(req.body.password, 10)
            user.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password

            await UserModel.findByIdAndUpdate(user._id, user)
            res.status(200).json({ "status": "actualizado" })

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    }
}