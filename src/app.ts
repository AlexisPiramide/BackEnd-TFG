import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import PaquetesRest from "./paquetes/infraestructure/rest/paquetes.rest"
import DimensionesRest from "./dimensiones/infraestructure/rest/dimensiones.rest"
import UsuariosRest from "./usuarios/infraestructure/rest/usuarios.rest"
import DireccionesRest from "./direcciones/infraestructure/rest/direcciones.rest"

import createMongoConnection from "../context/mongo.db";
createMongoConnection()

dotenv.config();

const allowedOrigins = ["http://localhost:5173","http://44.212.1.19:5174"];
//const allowedOrigins = ["*"]
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};


const app = express();
app.use(express.json());
app.use(cors(options));

app.use(`/api/dimensiones`, DimensionesRest);
app.use(`/paquetes`, PaquetesRest);
app.use(`/usuarios`, UsuariosRest);
app.use(`/direcciones`, DireccionesRest);


export default app;