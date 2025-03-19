import express, { Request, Response } from "express";

import direccionesUsecases from "../../application/direcciones.usecases";
import DireccionesRepository from "../../domain/direcciones.repository";
import DireccionesRepositoryMongo from "../db/direcciones.repository.postgres";
import { isAuth } from "../../../../context/security/auth";

const router = express.Router();

const direccionesRepository: DireccionesRepository = new DireccionesRepositoryMongo();
const direccionesusecases = new direccionesUsecases(direccionesRepository);

router.get('/:usuario', async (req: Request, res: Response) => {
    try {
        const direcciones = await direccionesusecases.getDireccionesUsuario(req.params.usuario);
        res.status(200).json(direcciones);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});


router.post('/:usuario',isAuth, async (req: Request, res: Response) => {

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

export default router;