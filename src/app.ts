import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import PaquetesRest from "./paquetes/infraestructure/rest/paquetes.rest";
import DimensionesRest from "./dimensiones/infraestructure/rest/dimensiones.rest";
import UsuariosRest from "./usuarios/infraestructure/rest/usuarios.rest";
import DireccionesRest from "./direcciones/infraestructure/rest/direcciones.rest";
import EnviosRest from "./envios/infraestructure/rest/envios.rest";
import createMongoConnection from "../context/mongo.db";  

// Connect to the database
createMongoConnection();

// Load environment variables
dotenv.config();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://front.alexis.daw.cpifppiramide.com"
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true, // optional, if you need cookies/auth headers
};

// Initialize app
const app = express();
app.use(express.json());

// ✅ Enable CORS
app.use(cors(options));

// ✅ Handle preflight requests
app.options("*", cors(options));

// Your API routes
app.use(`/api/dimensiones`, DimensionesRest);
app.use(`/paquetes`, PaquetesRest);
app.use(`/usuarios`, UsuariosRest);
app.use(`/envios`, EnviosRest);	
app.use(`/direcciones`, DireccionesRest);

// Base route
app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

export default app;
