import { TeamModel } from "../models/TeamsModel.js"
import { EventModel } from "../models/EventsModel.js"

export default {
    createTeam: async (req, res) => {
        try {

            const team = {
                name: req.body.name,
                id_members: req.body.id_members,
                leader: req.body.id_leader
            }

            await TeamModel.create(team)
            return res.status(200).json({ "status": "todo bien al crear el equipo" })

        } catch (err) {

            console.log(err)
            return res.status(500).json({ "status": "ocurrio un error al crear el equipo" })

        }
    },
    eventRegister: async (req, res) => {
        try {

            const id_team = req.params.id
            const team = await TeamModel.findById({ id_team })
            if (!team) return res.status(500).json({ "status": "no existe el equipo" })

            const id_event = req.params.id_event
            const event = await EventModel.findById({ id_event })
            if (!event) return res.status(500).json({ "status": "no existe el evento" })

            // await para registrar al equipo en un evento en especifico
            await EventModel.findByIdAndUpdate(id_event, {
                $push: {
                    "id_teams": id_team
                }
            })

            return res.status(200).json({ "status": "todo bien al inscribir el equipo en el evento" })

        } catch (err) {
            
            console.log(err)
            return res.status(500).json({ "status": "ocurrio un error en la inscripcion" })

        }
    }
}