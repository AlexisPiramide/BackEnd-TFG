import express, { Request, Response } from "express";

import Dimension from "../../../dimensiones/domain/Dimension";
import PaqueteRepository from "../../domain/paquetes.repository";
import PaquetesUsecases from "../../application/paquetes.usecases";
import PaqueteRepositoryPostgres from "../db/paquetes.repository.postgres";

const router = express.Router();

const paquetesrepository: PaqueteRepository = new PaqueteRepositoryPostgres();
const paquetesusecases = new PaquetesUsecases(paquetesrepository);

router.post('/', async (req: Request, res: Response) => {
    try {
        const dimensiones: Dimension = {
            id: req.body._id.$oid.toString(),
            nombre: req.body.nombre
        }
        const paquete = {dimensiones: dimensiones}

        const pedidos = await paquetesusecases.postPaquete(paquete);
        res.status(201).json(pedidos);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

export default router;