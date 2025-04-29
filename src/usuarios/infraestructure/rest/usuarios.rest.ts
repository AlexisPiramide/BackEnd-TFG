import express, { Request, Response } from "express";
import UsuariosRepository from "../../domain/usuarios.repository";
import usuariosRepositoryPostgres from "../db/usuarios.repository.postgres";
import UsuariosUsecases from "../../application/usuarios.usecases";
import Usuario from "../../domain/Usuario";
import { createToken, isAuth } from "./../../../../context/security/auth";

const router = express.Router();

const usuariosRepository: UsuariosRepository = new usuariosRepositoryPostgres();
const usuariosUsecases = new UsuariosUsecases(usuariosRepository);

router.post('/login', async (req: Request, res: Response)=> {
    /* #swagger.tags = ['Usuarios']
        #swagger.description = 'Endpoint para iniciar sesión'
        #swagger.responses[200] = { 
            description: 'Usuario logueado correctamente',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    nombre: { type: 'string' },
                    apellidos: { type: 'string' },
                    correo: { type: 'string' },
                    telefono: { type: 'string' }
                }
            }
        }
    */
    try {

        const usuario : Usuario = {
            correo: req.body.correo,
            contraseña: req.body.contraseña
        }

        const usuariodb: Usuario = await usuariosUsecases.login(usuario);

        const token = createToken(usuariodb);
        res.status(200).json({
            usuario: {
                id: usuariodb.id,   
                nombre: usuariodb.nombre,
                apellidos: usuariodb.apellidos,
                correo: usuariodb.correo,
                telefono: usuariodb.telefono
            },
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.post('/registro', async (req: Request, res: Response): Promise<any> => {
    /* #swagger.tags = ['Usuarios']
        #swagger.description = 'Endpoint para registrar un nuevo usuario'
        #swagger.responses[201] = { 
            description: 'Usuario registrado correctamente',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    nombre: { type: 'string' },
                    apellidos: { type: 'string' },
                    correo: { type: 'string' },
                    telefono: { type: 'string' }
                }
            }
        }
    */
    try {
        const usuario : Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
        }

        const usuariodb: Usuario = await usuariosUsecases.registro(usuario);
        if (usuariodb === null) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        
        const token = createToken(usuariodb);
        res.status(201).json({
            usuario: {
                id: usuariodb.id,   
                nombre: usuariodb.nombre,
                apellidos: usuariodb.apellidos,
                correo: usuariodb.correo,
                telefono: usuariodb.telefono
            },
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.post('/admin/registro',isAuth, async (req: Request, res: Response): Promise<any> => {
    /* #swagger.tags = ['Usuarios']
        #swagger.description = 'Endpoint para registrar un nuevo usuario'
        #swagger.responses[201] = { 
            description: 'Usuario registrado correctamente',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    nombre: { type: 'string' },
                    apellidos: { type: 'string' },
                    correo: { type: 'string' },
                    telefono: { type: 'string' }
                }
            }
        }
    */
    try {
        const usuario : Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
        }   

        const usuariodb: Usuario = await usuariosUsecases.registro(usuario);
        if (usuariodb === null) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        
        res.status(201).json({
            usuario: {
                id: usuariodb.id,   
                nombre: usuariodb.nombre,
                apellidos: usuariodb.apellidos,
                correo: usuariodb.correo,
                telefono: usuariodb.telefono
            }});
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const usuariodb = await usuariosUsecases.getUsuario(id);
        res.status(200).json(usuariodb);
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});



export default router;