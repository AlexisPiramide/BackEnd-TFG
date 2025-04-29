import express, { Request, Response } from "express";

import dimensionesUsecases from "../../application/dimensiones.usecases";
import DimensionesRepository from "../../domain/dimensiones.repository";
import DimensionesRepositoryMongo from "../db/dimensiones.repository.mongo";

const router = express.Router();

const dimensionesrepository: DimensionesRepository = new DimensionesRepositoryMongo();
const dimensionesusecases = new dimensionesUsecases(dimensionesrepository);

router.get('/', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Dimensiones'], #swagger.description = 'Endpoint para obtener todas las dimensiones de los paquetes', #swagger.responses[200] = { description: 'Dimensiones obtenidas correctamente', schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, ancho: { type: 'number' }, alto: { type: 'number' }, largo: { type: 'number' }, peso: { type: 'number' } } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } } */
    try {
        const dimensiones = await dimensionesusecases.getDimensiones();
        res.status(200).json(dimensiones);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});



export default router;