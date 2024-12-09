import { TeamsModel } from "../models/TeamsModel.js";
import { EventsModel } from "../models/EventsModel.js";

export default {

    getTeam: async (req, res) => {
        try { 
            const data = await TeamsModel.find();
            return res.status(200).send(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "status": "Ocurrió un error" });
        }
    },
    
    createTeam: async (req, res) => {
        try {
            const { name, id_members, leader, round } = req.body;

            // Validar que los campos necesarios estén presentes
            if (!name) {
                return res.status(400).json({ "status": "El nombre del equipo es obligatorio" });
            }

            if (!id_members || id_members.length === 0) {
                return res.status(400).json({ "status": "Debe haber al menos un miembro en el equipo" });
            }

            if (!leader) {
                return res.status(400).json({ "status": "El líder del equipo es obligatorio" });
            }

            // Verificar que el líder exista en la base de datos
            // const leaderExists = await UserModel.findById(leader); // Asegúrate de tener el modelo de User importado
            // if (!leaderExists) {
            //     return res.status(400).json({ "status": "El líder especificado no existe" });
            // }

            // Verificar que los miembros existan
            // for (let member of id_members) {
            //     const user = await UserModel.findById(member.id);
            //     if (!user) {
            //         return res.status(400).json({ "status": El miembro ${member.memberName} no existe });
            //     }
            // }

            // Crear el equipo
            const team = {
                name,
                id_members,
                leader,
                round: round || 0
            };

            // Guardar el equipo en la base de datos
            await TeamsModel.create(team);
            return res.status(200).json({ "status": "Equipo creado con éxito" });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ "status": "Ocurrió un error al crear el equipo" });
        }
    },

    eventRegister: async (req, res) => {
        try {
            const id_team = req.params.id;
            const team = await TeamsModel.findById(id_team);
            if (!team) return res.status(500).json({ "status": "No existe el equipo" });

            const id_event = req.params.id_event;
            const event = await EventsModel.findById(id_event);
            if (!event) return res.status(500).json({ "status": "No existe el evento" });

            // Registrar al equipo en un evento específico
            await EventsModel.findByIdAndUpdate(id_event, {
                $push: {
                    "id_teams": id_team
                }
            });

            return res.status(200).json({ "status": "Equipo inscrito en el evento con éxito" });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ "status": "Ocurrió un error en la inscripción" });
        }
    }
};

