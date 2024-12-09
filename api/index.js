import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userController from "./controllers/userController.js";
import EventsController from "./controllers/EventsController.js";
import TeamsController from "./controllers/TeamsController.js";

dotenv.config();

const app = express();

mongoose.connect(process.env.url)
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch((err) => {
        console.log('Error al conectar a la base de datos', err);
    });

app.use(cors());
app.use(helmet());
app.use(express.json());

// Ruta base para ver si el servidor está funcionando
app.get('/', (req, res) => {
    res.send("Servidor funcionando :)");
});

// Rutas de Usuarios
app.post('/user/register', userController.register);
app.put('/user/update-profile/:id', userController.update);
app.post('/user/login', userController.login);
app.post('/user/list', userController.getUsers);

// Rutas de Eventos
app.post('/event/create', EventsController.createEvent);
app.get('/event/create', EventsController.getEvents);

// Rutas de Equipos
app.post('/teams/create', TeamsController.createTeam);
app.put('/teams/register/:id/:id_event', TeamsController.eventRegister); 
app.get('/teams', TeamsController.getTeam); 

app.listen(4000, () => console.log("Servidor corriendo en el puerto 4000 :)"));