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
    /* #swagger.tags = ['Envios'] #swagger.description = 'Endpoint para registrar un nuevo envio' #swagger.parameters[0] = { in: 'body', description: 'Datos del envio', required: true, schema: { type: 'object', properties: { id: { type: 'string' }, usuario: { type: 'string' }, tipo: { type: 'string' } } } } #swagger.responses[201] = { description: 'Envio registrado correctamente' } #swagger.responses[400] = { description: 'Datos inválidos' } #swagger.responses[500] = { description: 'Error en el servidor' } */
    try {
        const id = req.body.id;
        const usuario = req.params.usuario;
        const tipo = req.body.tipo;
        const envio = await enviosusecases.tracking(id, usuario, tipo);
        res.status(201).json(envio);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar el envio`, error);
    }
});

router.get('/tracking/:id', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Envios'] #swagger.description = 'Endpoint para obtener el estado de un envio' #swagger.responses[200] = { description: 'Envio encontrado' } #swagger.responses[404] = { description: 'No encontrado' } #swagger.responses[500] = { description: 'Error en el servidor' } */
    try {
        const id = req.params.id;
        console.log("ID",id);
        const envio = await enviosusecases.getTracking(id);
        console.log("ENVIO",envio);
        res.status(200).json(envio);
        
    } catch (error) {
        console.log("ERROR",error);
        throw new ErrorPersonalizado(`Error al buscar el envio`, error);
    }
});

export default router;