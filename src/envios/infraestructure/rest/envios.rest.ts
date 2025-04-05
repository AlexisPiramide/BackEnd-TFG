import express from 'express';
import { Request, Response } from 'express';
import  EnvioRepository  from './../../domain/envios.repository';
import  EnviosUsecases  from './../../application/envios.usecases';
import enviosrepositoryMongo from '../db/envios.repository.mongo';
import ErrorPersonalizado from '../../../Error/ErrorPersonalizado';


const router = express.Router();

const enviosrepository: EnvioRepository = new enviosrepositoryMongo();
const enviosusecases = new EnviosUsecases(enviosrepository);

router.post('/tracking/:usuario', async (req: Request, res: Response) => {
    try {
        const id = req.body.id;
        const usuario = req.params.usuario;
        const tipo = req.body.tipo;
        const envio = await enviosusecases.tracking(id, usuario, tipo);
        res.status(200).json(envio);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar el envio`, error);
    }
});

router.get('/tracking/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const envio = await enviosusecases.getTracking(id);
        res.status(200).json(envio);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al buscar el envio`, error);
    }
});

