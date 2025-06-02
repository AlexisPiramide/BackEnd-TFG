import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import PaquetesRest from "./paquetes/infraestructure/rest/paquetes.rest";
import DimensionesRest from "./dimensiones/infraestructure/rest/dimensiones.rest";
import UsuariosRest from "./usuarios/infraestructure/rest/usuarios.rest";
import DireccionesRest from "./direcciones/infraestructure/rest/direcciones.rest";
import EnviosRest from "./envios/infraestructure/rest/envios.rest";
import createMongoConnection from "../context/mongo.db";  

createMongoConnection();

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://front.alexis.daw.cpifppiramide.com"
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const app = express();
app.use(express.json());

app.use(cors(options));

app.options("*", cors(options));

app.use(`/api/dimensiones`, DimensionesRest);
app.use(`/paquetes`, PaquetesRest);
app.use(`/usuarios`, UsuariosRest);
app.use(`/envios`, EnviosRest);	
app.use(`/direcciones`, DireccionesRest);

app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

export default app;
