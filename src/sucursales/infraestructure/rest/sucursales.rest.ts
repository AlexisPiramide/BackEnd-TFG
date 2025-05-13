import express, { Request, Response } from 'express';
import  SucursalRepository  from './../../domain/sucursales.repository';
import  SucursalesUsecases  from './../../application/sucursales.usecases';
import  SucursalRepositoryMongo  from './../../infraestructure/db/sucursales.repository.postgres';
import ErrorPersonalizado from '../../../Error/ErrorPersonalizado';
import Sucursal from '../../domain/Sucursal';
import { isAdmin } from '../../../../context/security/auth';
import Usuario from '../../../usuarios/domain/Usuario';


const router = express.Router();

const sucursalRepository: SucursalRepository = new SucursalRepositoryMongo();
const sucursalesUsecases = new SucursalesUsecases(sucursalRepository);

router.get('/', async (req: Request, res: Response) => {
    // #swagger.tags = ['Sucursales'], #swagger.description = 'Endpoint para obtener todas las sucursales', #swagger.responses[200] = { description: 'Lista de sucursales', schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, direccion: { type: 'string' }, telefono: { type: 'string' } } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const sucursal = await sucursalesUsecases.getSucursales();
        res.status(200).json(sucursal);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar la sucursal`, error);
    }
});

router.get('/:sucursal', async (req: Request, res: Response) => {
    // #swagger.tags = ['Sucursales'], #swagger.description = 'Endpoint para obtener una sucursal por su ID', #swagger.parameters[0] = { in: 'path', description: 'ID de la sucursal', required: true, type: 'string' }, #swagger.responses[200] = { description: 'Sucursal encontrada', schema: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, direccion: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[404] = { description: 'Sucursal no encontrada', schema: { type: 'object', properties: { message: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const id = req.params.id;
        const sucursal = await sucursalesUsecases.getSucursal(id);
        res.status(200).json(sucursal);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al buscar la sucursal`, error);
    }
});

router.post('/',isAdmin, async (req: Request, res: Response) => {
    // #swagger.tags = ['Sucursales'], #swagger.description = 'Endpoint para crear una nueva sucursal', #swagger.parameters[0] = { in: 'body', description: 'Datos de la sucursal a crear', required: true, schema: { type: 'object', properties: { nombre: { type: 'string' }, direccion: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[201] = { description: 'Sucursal creada correctamente', schema: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, direccion: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const sucursal : Sucursal = {
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            telefono: req.body.telefono
        }

        const sucursaldb = await sucursalesUsecases.crearSucursal(sucursal);
        res.status(201).json(sucursaldb);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar la sucursal`, error);
    }
});


router.post('/trabajador',isAdmin, async (req: Request, res: Response) => {

    try{
        const trabajador: Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
            puesto: req.body.puesto
        }

        const sucursal = req.body.sucursal;

        const trabajadorCreado = await sucursalesUsecases.crearTrabajador(trabajador, sucursal);
        res.status(201).json(trabajadorCreado);

    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar la sucursal`, error);
    }

});

router.patch('/:sucursal',isAdmin, async (req: Request, res: Response) => {

    try {
        const id = req.params.sucursal;
        const trabajador: Usuario = {
            id: req.body.id,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
            puesto: req.body.puesto
        }

        const trabajadorCreado = await sucursalesUsecases.vincularTrabajador(id, trabajador);
        res.status(201).json(trabajadorCreado);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar la sucursal`, error);
    }

});

export default router;