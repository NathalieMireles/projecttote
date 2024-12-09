//Crear eventos
//Actualizar
//Cambiar status
//Cambiar de ronda (Eliminar a los equipos)
import { EventsModel } from "../models/EventsModel.js";
import { GradesModel } from "../models/GradesModel.js";
import { TeamsModel } from "../models/TeamsModel.js";

const validateEvent = (metrics, name, maxRound) => {
    const data = {
        isValid: false,
        msg: ""
    }

    if (!Array.isArray(metrics)) {
        data.msg = "Metricas no es un arreglo"
        return data

    }
    //Validar que tiene al menos una metrica
    if (!(req.body.metrics.length > 0)) {
        data.msg = "Metricas vienee vacio"
        return data
    }
    //Validar que descripcion y maximo de puntos exite
    //iterar
    const incompleteMetrics = req.body.metrics.filter((metric) => (!metric.description) ||
        (!metric.max_points));
    if (incompleteMetrics.length > 0) {
        data.msg = "Alguna de las metricas esta incompleta"
        return data
    }
    //Validar que descripcion si tiene texto
    //Validar que el maximo de puntos es mayor a 0

    const invalidMetrics = req.body.metrics.filter((metric) => metric.description.length === 0 ||
        metric.max_points === 0);
    if (invalidMetrics.length > 0) {
        data.msg = "Alguna de las metricas es invalida"
        return data
    }
    //Vaalidamos el nombre del evento
    if (!name && !name.length) {
        data.msg = "El nombre del evento esta vacio"
        return data
    }
    //Validamos que maximo de rondas es mayor que 0
    if (!maxRound) {
        data.msg = "Numero maximo de rondas invalido"
        return data
    }
    //En caso que ninguna validacion se cumpla
    data.isValid = true;
    return data;
}

export default {

    getEvents:async(req, res) => {
        try { 
            const data = await EventsModel.find()
            return res.status(200).send(data)
            } catch (err) {
                console.log(err)
                return res.status(500).json({ "status": "ocurrio un error" })
        }
    
    },
    createEvent: async (req, res) => {
        try{
            const {metrics, title, maxRound} = req.body;
            const {isValid,msg} = validateEvent(metrics,title,maxRound);
            if(!isValid){
                return res.status(400).json({msg})
            }
            const event = {
                name: title,
                metrics: req.body.metrics,
                maxRound: req.body.maxRound,
            };
            await EventsModel.create(event);
            res.status(200).json({ msg: "Evento creado con exito" })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Error al crear el evento" })
        }
    },
    upateEvent: async (req, res) => {
        try{
        const idEvent = req.params.id;
        const event = await s.findById(idEvent);
        if (!event) {
            return res.status(400).json({ msg: "El evento no existe" });
        }
        const {metrics, name, maxRound} = req.body;
            const {isValid,msg} = validateEvent(metrics,name,maxRound);
            if(!isValid){
                return res.status(400).json({msg})
            }
            await EventsModel.findByIdAndUpdate(idEvent,{
                $set:{
                    metrics,
                    name,
                    maxRound
                }
            })
        }catch(error){
            return res.status(500).json({msg:"Error al actualizar el evento"})
        }
    },
    changeStatus: async (req,res)=>{
        try{
        const idEvent = req.params.id;
        const event = await s.findById(idEvent);
        if(!event){
            return res.status(400).json({msg:"Evento no encontrado"})
        }
        if(!["pending","active","done"].includes(req.body.status.toLowerCase())){
            return res.status(400).json({msg:"El status que envias no es aceptable."})
        }
        await EventsModel.findByIdAndUpdate(idEvent,{
            $set:{
                status:req.body.status
            }
            });
            return res.status(200).json({msg:"Se actualizo el status con exito"})
        }catch(error){
            return res.status(500).json({msg:"Error al cambiar el status"})
        }
    },
    changeRound: async (req,res)=>{
        try{
        const idEvent = req.params.id;
        const event = await EventsModel.findById(idEvent);
        if(!event){
            return res.status(400).json({msg:"Evento no encontrado"})
        }
        const teamsPerRound = req.query.maxTeams ? req.query.maxTeams : 5;
        //1. Traer calificaciones por grupo
        const { groups } = event;
        const teamsWithFinalGrade =[]
        for(const group of groups){
            const gradesPerMetric =[]
            //Aqui tenemos calificacion por grupo
            const { grades } = await GradeModel.findOne({id_event:event._id, id_group: group});
            //2. Promediar por metrica
            const alreadyChecked = [];
            for(const grade of grades){
                const filteredGrades = grades.filter(item=>
                grade.id_metric === item.id_metric && !alreadyChecked.includes(grade.id_metric)
                )
                console.log(filteredGrades)
                let gradesPerMetric = 0
                if(filteredGrades.length > 0 ){
                    gradesPerMetric = filteredGrades.reduce((a,b)=> a.grade + b.grade );
                }
                if (!alreadyChecked.includes(grade.id_metric)){
                    alreadyChecked.push(filteredGrades[0].id_metric)
                    gradesPerMetric.push({
                    id_metric:grade.id_metric,
                    grade:gradesPerMetric/ filteredGrades.length
                    })
                }
            }  //3. Promedio final
            const finalGrade = gradesPerMetric.reduce((a,b)=> a.grade+b.
            grade) / gradesPerMetric.length
           teamsWithFinalGrade.push({
            idTeam: group,
            finalGrade,
            gradesPerMetric
           })
        }
       
        //4. Ordenar de mayor a menor(COMO?)
   const sortedTeams = teamsWithFinalGrade.sort((a,b)=> a-b)
        //5. Tomar solo la cantidad de maximo de puntos
const passedTeams = sortedTeams.slice(0,teamsPerRound)
    //Actualizar la ronda de los equipos
    for(const team of passedTeams){
        await TeamsModel.findByIdAndUpdate(team.idTeam,
            {
                $set:{
                    round:req.body.round,
                    
                }
       })
    }
    //Actualizar el arreglo de equipos en ele evento
    const nextTeams = passedTeams.map((i)=> i.idTeam)
await EventsModel.findByIdAndUpdate(event._id,{
    $set:{
        groups:nextTeams,
        round:req.body.round
    }
})

    } catch(error){
        return res.status(500).json({msg:"Error al cambiar de ronda"})
    }
}
}