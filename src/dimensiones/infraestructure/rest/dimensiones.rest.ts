import express, { Request, Response } from "express";

import dimensionesUsecases from "../../application/dimensiones.usecases";
import DimensionesRepository from "../../domain/dimensiones.repository";
import DimensionesRepositoryMongo from "../db/dimensiones.repository.mongo";

const router = express.Router();

const dimensionesrepository: DimensionesRepository = new DimensionesRepositoryMongo();
const dimensionesusecases = new dimensionesUsecases(dimensionesrepository);

router.get('/dimensiones', async (req: Request, res: Response) => {
    try {
        const dimensiones = await dimensionesusecases.getDimensiones();
        res.status(200).json(dimensiones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;