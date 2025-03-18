import express, { Request, Response } from "express";

import direccionesUsecases from "../../application/direcciones.usecases";
import DireccionesRepository from "../../domain/direcciones.repository";
import DireccionesRepositoryMongo from "../db/direcciones.repository.postgres";

const router = express.Router();

const direccionesRepository: DireccionesRepository = new DireccionesRepositoryMongo();
const direccionesusecases = new direccionesUsecases(direccionesRepository);

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const direcciones = await direccionesusecases.getDireccionesUsuario(req.params.id);
        res.status(200).json(direcciones);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

export default router;