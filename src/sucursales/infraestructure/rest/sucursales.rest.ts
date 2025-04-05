import express, { Request, Response } from 'express';
import  SucursalRepository  from './../../domain/sucursales.repository';
import  SucursalesUsecases  from './../../application/sucursales.usecases';
import  SucursalRepositoryMongo  from './../../infraestructure/db/sucursales.repository.postgres';
import ErrorPersonalizado from '../../../Error/ErrorPersonalizado';


const router = express.Router();

const sucursalRepository: SucursalRepository = new SucursalRepositoryMongo();
const sucursalesUsecases = new SucursalesUsecases(sucursalRepository);

router.get('/', async (req: Request, res: Response) => {
    try {
        const sucursal = await sucursalesUsecases.getSucursales();
        res.status(200).json(sucursal);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al insertar la sucursal`, error);
    }
});

router.get('/:sucursal', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const sucursal = await sucursalesUsecases.getSucursal(id);
        res.status(200).json(sucursal);
    } catch (error) {
        throw new ErrorPersonalizado(`Error al buscar la sucursal`, error);
    }
});

export default router;