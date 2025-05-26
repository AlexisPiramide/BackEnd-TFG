import express, { Request, Response } from "express";
import UsuariosRepository from "../../domain/usuarios.repository";
import usuariosRepositoryPostgres from "../db/usuarios.repository.postgres";
import UsuariosUsecases from "../../application/usuarios.usecases";
import Usuario from "../../domain/Usuario";
import { createToken, isAdmin, isAuth } from "./../../../../context/security/auth";

import Sucursal from "../../../sucursales/domain/Sucursal";

const router = express.Router();

const usuariosRepository: UsuariosRepository = new usuariosRepositoryPostgres();
const usuariosUsecases = new UsuariosUsecases(usuariosRepository);

router.post('/login', async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para iniciar sesión', #swagger.parameters[0] = { in: 'body', description: 'Datos para iniciar sesión del usuario', required: true, schema: { type: 'object', properties: { correo: { type: 'string', description: 'Correo electrónico del usuario' }, contraseña: { type: 'string', description: 'Contraseña del usuario' } } } }, #swagger.responses[200] = { description: 'Usuario logueado correctamente', schema: { type: 'object', properties: { usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } }, token: { type: 'string' } } } }, #swagger.responses[400] = { description: 'Solicitud incorrecta (por ejemplo, falta un campo obligatorio)', schema: { type: 'object', properties: { message: { type: 'string' } } } }, #swagger.responses[401] = { description: 'Credenciales incorrectas', schema: { type: 'object', properties: { message: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const usuario: Usuario = {
            correo: req.body.correo,
            contraseña: req.body.contraseña
        }

        const usuariodb: Usuario = await usuariosUsecases.login(usuario);
        console.log("usuario ",usuariodb)
        const token = createToken(usuariodb);
        res.status(200).json({
            usuario: devolverUsuario(usuariodb),
            token: token
        });


    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.put('/actualizar', isAuth, async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para actualizar los datos del usuario', #swagger.parameters[0] = { in: 'body', description: 'Datos del usuario a actualizar', required: true, schema: { type: 'object', properties: { nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[200] = { description: 'Usuario actualizado correctamente', schema: { type: 'object', properties: { usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado o error en la actualización', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[401] = { description: 'No autorizado para realizar esta acción (se requiere autenticación de administrador)', schema: { type: 'object', properties: { message: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const usuarioActualizado = {
            id : req.body.id,
            nombre : req.body.datos.nombre,
            apellidos : req.body.datos.apellidos,
            correo : req.body.datos.correo,
            telefono : req.body.datos.telefono
        }
        console.log(req.body)
        const usuariodb = await usuariosUsecases.actualizar(usuarioActualizado);

        const token = createToken(usuariodb);
        res.status(200).json({
            usuario: devolverUsuario(usuariodb),
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.post('/registro', async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para registrar un nuevo usuario', #swagger.parameters[0] = { in: 'body', description: 'Datos para registrar un nuevo usuario', required: true, schema: { type: 'object', properties: { nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, contraseña: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[201] = { description: 'Usuario registrado correctamente', schema: { type: 'object', properties: { usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } }, token: { type: 'string' } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado o error en el registro', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const usuario: Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
        }

        const usuariodb: Usuario = await usuariosUsecases.registro(usuario);
        const token = createToken(usuariodb);

        res.status(201).json({
            usuario: devolverUsuario(usuariodb),
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.post('/admin/registro', isAdmin, async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para registrar un nuevo usuario (solo administradores)', #swagger.parameters[0] = { in: 'body', description: 'Datos para registrar un nuevo usuario', required: true, schema: { type: 'object', properties: { nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, contraseña: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[201] = { description: 'Usuario registrado correctamente', schema: { type: 'object', properties: { usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado o error en el registro', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[401] = { description: 'No autorizado para realizar esta acción (se requiere autenticación de administrador)', schema: { type: 'object', properties: { message: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const usuario: Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
        }

        const usuariodb: Usuario = await usuariosUsecases.registro(usuario);
        res.status(201).json({
            usuario: devolverUsuario(usuariodb)
        });
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});


router.get('/:id', isAuth, async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para obtener un usuario por ID', #swagger.parameters[0] = { in: 'path', description: 'ID del usuario', required: true, type: 'string' }, #swagger.responses[200] = { description: 'Usuario encontrado', schema: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[401] = { description: 'No autorizado para realizar esta acción (se requiere autenticación de administrador)', schema: { type: 'object', properties: { message: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const id = req.params.id;
        const usuariodb: Usuario = await usuariosUsecases.getUsuario(id);
        
        res.status(200).json(devolverUsuario(usuariodb));
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.post("/existe", async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para verificar si un usuario existe', #swagger.parameters[0] = { in: 'body', description: 'Datos del usuario a verificar', required: true, schema: { type: 'object', properties: { correo: { type: 'string' } } } }, #swagger.responses[200] = { description: 'Usuario encontrado', schema: { type: 'object', properties: { existe: { type: 'boolean' } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const usuario: Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo
        }
        const existe = await usuariosUsecases.encontrarcondatos(usuario);
        res.status(200).json({ existe });
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.get("/y&$1m9x41/registroExterno/:id", async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para convertir un usuario externo', #swagger.parameters[0] = { in: 'path', description: 'ID del usuario externo', required: true, type: 'string' }, #swagger.parameters[1] = { in: 'body', description: 'Datos del usuario externo', required: true, schema: { type: 'object', properties: { nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } } }, #swagger.responses[201] = { description: 'Usuario registrado correctamente', schema: { type: 'object', properties: { usuario: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, apellidos: { type: 'string' }, correo: { type: 'string' }, telefono: { type: 'string' } } }, token: { type: 'string' } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado o error en el registro', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const id = req.params.id;
        const usuario: Usuario = {
            id: id,
            contraseña: req.body.contraseña
        }

        const usuariodb: Usuario = await usuariosUsecases.convertirdeUsuarioExterno(usuario);
        const token = createToken(usuariodb);
        res.status(201).json({
            usuario: devolverUsuario(usuariodb),
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.get("/isExterno/:id", async (req: Request, res: Response) => {
    // #swagger.tags = ['Usuarios'], #swagger.description = 'Endpoint para verificar si un usuario es externo', #swagger.parameters[0] = { in: 'path', description: 'ID del usuario', required: true, type: 'string' }, #swagger.responses[200] = { description: 'Usuario encontrado', schema: { type: 'object', properties: { existe: { type: 'boolean' } } } }, #swagger.responses[404] = { description: 'Usuario no encontrado', schema: { type: 'object', properties: { mensaje: { type: 'string' } } } }, #swagger.responses[500] = { description: 'Error en el servidor', schema: { type: 'object', properties: { message: { type: 'string' } } } }
    try {
        const id = req.params.id;
        const existe = await usuariosUsecases.isExterno(id);
        res.status(200).json({ existe });
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

const devolverUsuario = (usuariodb: Usuario) => {
    const usuario: Usuario = {
        id: usuariodb.id,
        nombre: usuariodb.nombre,
        apellidos: usuariodb.apellidos,
        correo: usuariodb.correo,
        telefono: usuariodb.telefono,
    }

    if (usuariodb.sucursal) {
        const sucursal: Sucursal = {
            id: usuariodb.sucursal.id,
            nombre: usuariodb.sucursal.nombre,
            telefono: usuariodb.sucursal.telefono,
            direccion: null,
        }
        usuario.sucursal = sucursal;
    }

    return usuario;
}

export default router;