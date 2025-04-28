import express, { Request, Response } from "express";

import direccionesUsecases from "../../application/direcciones.usecases";
import DireccionesRepository from "../../domain/direcciones.repository";
import DireccionesRepositoryMongo from "../db/direcciones.repository.postgres";
import { isAuth } from "../../../../context/security/auth";

const router = express.Router();

const direccionesRepository: DireccionesRepository = new DireccionesRepositoryMongo();
const direccionesusecases = new direccionesUsecases(direccionesRepository);

router.get('/:usuario', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Direcciones']
        #swagger.description = 'Endpoint para obtener todas las direcciones de un usuario'
        #swagger.responses[200] = { 
            description: 'Direcciones obtenidas correctamente',
            schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        calle: { type: 'string' },
                        numero: { type: 'integer' },
                        codigoPostal: { type: 'string' },
                        localidad: { type: 'string' },
                        provincia: { type: 'string' },
                        pais: { type: 'string' }
                    }
                }
            }
        }
    */
    try {
        const direcciones = await direccionesusecases.getDireccionesUsuario(req.params.usuario);
        res.status(200).json(direcciones);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});


router.post('/:usuario',isAuth, async (req: Request, res: Response) => {
    /* #swagger.tags = ['Direcciones']
        #swagger.description = 'Endpoint para añadir una nueva dirección a un usuario'
        #swagger.responses[201] = { 
            description: 'Dirección añadida correctamente',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    calle: { type: 'string' },
                    numero: { type: 'integer' },
                    codigoPostal: { type: 'string' },
                    localidad: { type: 'string' },
                    provincia: { type: 'string' },
                    pais: { type: 'string' }
                }
            }
        }
    */
   
    try {
        const direccion = {
            calle: req.body.calle,
            numero: req.body.numero,
            codigoPostal: req.body.codigoPostal,
            localidad: req.body.localidad,
            provincia: req.body.provincia,
            pais: req.body.pais
        }
        const usuario = req.params.usuario;
        const nuevaDireccion = await direccionesusecases.nuevaDireccionUsuario(usuario, direccion);
        res.status(201).json(nuevaDireccion);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.post('/',isAuth,async(req:Request,res: Response)=>{
    /* #swagger.tags = ['Direcciones']
        #swagger.description = 'Endpoint para añadir una nueva dirección'
        #swagger.responses[201] = { 
            description: 'Dirección añadida correctamente',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    calle: { type: 'string' },
                    numero: { type: 'integer' },
                    codigoPostal: { type: 'string' },
                    localidad: { type: 'string' },
                    provincia: { type: 'string' },
                    pais: { type: 'string' }
                }
            }
        }
    */
    try {
        const direccion = {
            calle: req.body.calle,
            numero: req.body.numero,
            codigoPostal: req.body.codigoPostal,
            localidad: req.body.localidad,
            provincia: req.body.provincia,
            pais: req.body.pais
        }
        const nuevaDireccion = await direccionesusecases.nuevaDireccion(direccion);
        res.status(201).json(nuevaDireccion);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.put('/:id',isAuth, async (req: Request, res: Response) => {
    /* #swagger.tags = ['Direcciones']
        #swagger.description = 'Endpoint para actualizar una dirección'
        #swagger.responses[200] = { 
            description: 'Dirección actualizada correctamente',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    calle: { type: 'string' },
                    numero: { type: 'integer' },
                    codigoPostal: { type: 'string' },
                    localidad: { type: 'string' },
                    provincia: { type: 'string' },
                    pais: { type: 'string' }
                }
            }
        }
    */
    try {
        const direccion = {
            id:req.params.id,
            calle: req.body.calle,
            numero: req.body.numero,
            codigoPostal: req.body.codigoPostal,
            localidad: req.body.localidad,
            provincia: req.body.provincia,
            pais: req.body.pais
        }
        const nuevaDireccion = await direccionesusecases.updateDireccion(direccion);
        res.status(200).json(nuevaDireccion);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.delete('/:id',isAuth, async (req: Request, res: Response) => {
    /* 
    #swagger.tags = ['Direcciones']
    #swagger.description = 'Endpoint para eliminar una dirección'
    #swagger.responses[200] = { 
        description: 'Dirección eliminada correctamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                calle: { type: 'string' },
                numero: { type: 'integer' }, 
                codigoPostal: { type: 'string' },
                localidad: { type: 'string' },
                provincia: { type: 'string' },
                pais: { type: 'string' }
            }
        }
    }
    */

    try {
        const direccion = await direccionesusecases.eliminarDireccion(req.params.id);
        res.status(200).json(direccion);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});



export default router;