import { TeamModel } from "../models/TeamsModel.js"
import { EventModel } from "../models/EventsModel.js"
import { ScoresModel } from "../models/ScoresModel.js"

export default {
    createScore: async(req, res) => {
        try {

            const id_team = req.params.id_team
            const team = await TeamModel.findById(id_team)
            if (!team) res.status(400).json({ "status": "no hay equipo" })

            const round = req.body.round
            if (!round) res.status(400).json({ "status": "no hay ronda" })

            const id_event = req.params.id_event
            const event = await EventModel.findById(id_event)
            if (!event) res.status(400).json({ "status": "no hay evento" })

            if (!event.id_teams.includes(id_team)) res.status(400).json({ "status": "el equipo no esta en el evento" })
            
            // agregar calificaciones
            const scores_from_db = await ScoresModel.findOne({ id_event: id_event, round: round, id_team: id_team })
            scores_from_db.grades.filter((score) => (score.id_judge == req.body.id_judge))
            const scores = req.body.scores

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    }
}