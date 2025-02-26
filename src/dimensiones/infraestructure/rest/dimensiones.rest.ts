import express, { Request, Response } from "express";

import dimensionesUsecases from "../../application/dimensiones.usecases";
import DimensionesRepository from "../../domain/dimensiones.repository";
import DimensionesRepositoryMongo from "../db/dimensiones.repository.mongo";

const router = express.Router();

const dimensionesrepository: DimensionesRepository = new DimensionesRepositoryMongo();
const dimensionesusecases = new dimensionesUsecases(dimensionesrepository);

router.get('/', async (req: Request, res: Response) => {
    try {
        console.log("GET /api/dimensiones");
        const dimensiones = await dimensionesusecases.getDimensiones();
        res.status(200).json(dimensiones);
    } catch (error) {
        console.log(error);
        res.status(500).json("Ha ocurrido un error");
    }
});

export default router;