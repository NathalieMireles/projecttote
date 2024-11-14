import { EventModel } from "../models/EventsModel.js"
import { ScoresModel } from "../models/ScoresModel.js"

const validate_data = (metrics, name, max_round) => {

    const data = {
        isValid: true,
        msg: ""
    }

    // const metrics = metrics

    if (metrics.length > 0 || Array.isArray(metrics)) {
        data.msg = "metricas no es un array"
        return data
    }

    const incompleted_metrics = metrics.filter((metric) => (!metric.description) || (!metric.max_points))
    if (incompleted_metrics.length > 0) {
        data.msg = "alguna metrica viene vacia"
        return data
    }

    const invalid_metrics = metrics.filter((metric) => (metric.description.length === 0) || (metric.max_points > 0))
    if (invalid_metrics.length > 0) {
        data.msg = "alguna metrica viene vacia"
        return data
    }

    if (!name && !name.length) {
        data.msg = "el nombre viene vacio"
        return data
    }

    if (!max_round) {
        data.msg = "el maximo de rondas viene vacio"
        return data
    }

    data.isValid = true

    return data

}

export default {
    createEvent: async (req, res) => {
        try {

            const { metrics, name, max_round } = req.body
            const { isValid, msg } = validate_data(metrics, name, max_round)

            if (!isValid) return res.status(400).json({ msg })

            const event = {
                name: name,
                metrics: metrics,
                max_round: max_round
            }

            await EventModel.create(event)
            res.status(200).json({ "status": "se creo bien el evento" })

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    },
    updateEvent: async (req, res) => {
        try {

            const id_event = req.params.id
            const event = await EventModel.findById({ id_event })
            if (!event) return res.status(400).json({ "status": "evento no encontrado" })

            const { metrics, name, max_round } = req.body
            const { isValid, msg } = validate_data(metrics, name, max_round)

            if (!isValid) return res.status(400).json({ msg })

            await EventModel.findByIdAndUpdate(id_event, {
                $set: {
                    metrics,
                    name,
                    max_round
                }
            })

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    },
    changeStatus: async (req, res) => {
        try {

            const id_event = req.params.id
            const event = await EventModel.findById({ id_event })
            if (!event) return res.status(400).json({ "status": "evento no encontrado" })

            if (!['pending', 'active', 'done'].includes(req.body.status.toLowerCase())) return res.status(400).json({ "status": "status invalido en el sistema" })

            await EventModel.findByIdAndUpdate(id_event, {
                $set: {
                    status: req.body.status
                }
            })

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    },
    changeRound: async (req, res) => {
        try {

            const id_event = req.params.id
            const event = await EventModel.findById({ id_event })
            if (!event) return res.status(400).json({ "status": "evento no encontrado" })

            const teamsPerRound = req.query.max_teams ? req.query.max_teams : 5

            const { id_teams } = event

            const scoresPerMetric = []

            for (const team of id_teams) {
                const { scores } = await ScoresModel.findOne({ id_event: id_event, id_teams: team })
                const alreadyChecked = []
                for (const score of scores) {
                    const filteredScores = scores.filter(item => score.id_metric === item.id_metric && alreadyChecked.includes(score.id_metric))
                    console.log(filteredScores)
                    let scorePerMetric = 0
                    if (filteredScores.length > 0) {
                        scorePerMetric = filteredScores.reduce(a, b => a.score + b.score)
                    }
                    if (alreadyChecked.includes(score.id_metric)) {
                        alreadyChecked.push(filteredScores[0].id_metric)
                        scoresPerMetric.push({
                            id_metric: score.id_metric,
                            score: score.score
                        })
                    }
                    console.log(scorePerMetric)
                }
            }

            const finalScore = scoresPerMetric.reduce( a, b => a.score + b.score )

            // esta cosa es mi solucion
            // const best_scores = await ScoresModel.find({ id_event: id_event, round: req.body.round }).sort({ 'scores.score': -1 }).limit(teamsPerRound)

        } catch (err) {

            res.status(500).json({ "status": "un quinienton" })
            console.log(err)

        }
    }
}