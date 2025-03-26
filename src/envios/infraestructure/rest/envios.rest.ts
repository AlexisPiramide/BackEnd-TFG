import express from 'express';
import { Request, Response } from 'express';
import  EnvioRepository  from './../../domain/envios.repository';
import  EnviosUsecases  from './../../application/envios.usecases';
import  EnvioRepositoryPostgres  from './../db/envios.repository.postgres';


const router = express.Router();

const enviosrepository: EnvioRepository = new EnvioRepositoryPostgres();
const enviosusecases = new EnviosUsecases(enviosrepository);


router.post('/', async (req: Request, res: Response) => {
    try {
        const paquete = req.body.paquete;
        const usuario = req.body.usuario

        const envio = await enviosusecases.postEnvio(paquete,usuario);
        res.status(201).json(envio);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.post('/tracking', async (req: Request, res: Response) => {
    try {
        const id = req.body.id;
        const usuario = req.body.usuario

        const envio = await enviosusecases.tracking(id,usuario);
        res.status(200).json(envio);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});