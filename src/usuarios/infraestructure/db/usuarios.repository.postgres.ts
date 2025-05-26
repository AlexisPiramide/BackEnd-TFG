import executeQuery from "../../../../context/postgres.db";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado";
import Usuario from "../../domain/Usuario";
import usuariosRepository from "../../domain/usuarios.repository";

export default class usuariosRepositoryPostgres implements usuariosRepository {

    async login(usuario: Usuario): Promise<Usuario> {

        const queryLogin = 'SELECT * FROM Usuario WHERE correo = $1';
        const values = [usuario.correo];

        const result: any = await executeQuery(queryLogin, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("Usuario no encontrado", 404);
        }

        const usuarioDB: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            contraseña: result[0].contraseña,
            telefono: result[0].telefono,
        };

        const sucursal = result[0].sucursal;
        if (sucursal) {
            const querySucursal = `
                SELECT s.nombre 
                FROM Sucursal s 
                JOIN Direccion d ON s.id_direccion = d.id 
                WHERE s.id = $1
            `;
            const valuesSucursal = [sucursal];
            const resultSucursal: any = await executeQuery(querySucursal, valuesSucursal);
            usuarioDB.sucursal = {
                id: sucursal,
                telefono: resultSucursal[0].telefono,
                nombre: resultSucursal[0].nombre,
                direccion: resultSucursal[0].direccion,
            };
        }

        return usuarioDB;
    }


    async registro(usuario: Usuario): Promise<Usuario> {
        const queryRegistro = 'INSERT INTO Usuario (id,nombre, correo, "contraseña",apellidos,telefono,es_externo,sucursal,puesto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const values = [usuario.id, usuario.nombre, usuario.correo, usuario.contraseña, usuario.apellidos, usuario.telefono, false, null, null];

        const result: any = await executeQuery(queryRegistro, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("Error al registrar el usuario", 500);
        }

        const usuarioRegistrado: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            contraseña: result[0].contraseña,
            telefono: result[0].telefono,
        }

        return usuarioRegistrado;
    }

    async registrarUsuarioExterno(usuario: Usuario): Promise<Usuario> {
        const queryRegistroExterno = `INSERT INTO Usuario (id, nombre, apellidos, correo, telefono, es_externo, sucursal, puesto, es_admin, "contraseña") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)RETURNING *`;
        const values = [usuario.id, usuario.nombre, usuario.apellidos, usuario.correo || null, usuario.telefono || null, true, null, null, false, null];

        const result: any = await executeQuery(queryRegistroExterno, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("Error al registrar el usuario externo", 500);
        }

        const usuarioExternoRegistrado: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            telefono: result[0].telefono
        };

        return usuarioExternoRegistrado;
    }

    async comporbarID(idGenerado: string): Promise<boolean> {
        const queryComprobarID = 'SELECT * FROM Usuario WHERE id = $1';
        const values = [idGenerado];
        const result: any = await executeQuery(queryComprobarID, values);
        if (result.length === 0) {
            return false;
        }
        return true;
    }

    async getUsuario(id: string): Promise<Usuario> {
        const queryGetUsuario = 'SELECT * FROM Usuario WHERE id = $1';
        const values = [id];
        const result: any = await executeQuery(queryGetUsuario, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("Usuario no encontrado", 404);
        }

        const usuarioDB: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            telefono: result[0].telefono,
        };

        return usuarioDB;
    }

    async encontrarcondatos(usuario: Usuario): Promise<Usuario> {
        let query = '';
        let values: any[] = [];

        if (usuario.correo) {
            query = 'SELECT * FROM Usuario WHERE correo = $1';
            values = [usuario.correo];
        } else if (usuario.telefono) {
            query = 'SELECT * FROM Usuario WHERE telefono = $1';
            values = [usuario.telefono];
        } else {
            throw new ErrorPersonalizado("Debe proporcionar al menos un correo o teléfono para buscar el usuario.", 400);
        }

        const result: any = await executeQuery(query, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("No se ha encontrado ningún usuario con los datos proporcionados", 404);
        }

        const usuarioDB: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            telefono: result[0].telefono,
        };

        return usuarioDB;
    }

    async convertirdeUsuarioExterno(usuario: Usuario): Promise<Usuario> {

        const queryUpdate = ` UPDATE Usuario SET es_externo = FALSE, contraseña = $2 WHERE id = $1 RETURNING *;  `;

        const values = [
            usuario.id,
            usuario.contraseña
        ];

        const result: any = await executeQuery(queryUpdate, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("No se encontró el usuario para convertir.", 404);
        }

        const usuarioConvertido: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            telefono: result[0].telefono,

        };

        return usuarioConvertido;
    }

    async isExterno(id: string): Promise<Boolean> {
        const query = 'SELECT es_externo FROM Usuario WHERE id = $1';
        const values = [id];
        const result: any = await executeQuery(query, values);
        if (result.length === 0) {
            throw new ErrorPersonalizado("Usuario no encontrado", 404);
        }
        return result[0].es_externo;
    }

    async actualizar(usuario: Usuario): Promise<Usuario> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 2;

        if (usuario.nombre) {
            fields.push(`nombre = $${paramIndex++}`);
            values.push(usuario.nombre);
        }
        if (usuario.apellidos) {
            fields.push(`apellidos = $${paramIndex++}`);
            values.push(usuario.apellidos);
        }

        if (usuario.telefono) {
            fields.push(`telefono = $${paramIndex++}`);
            values.push(usuario.telefono);
        }

        if (usuario.contraseña) {
            fields.push(`"contraseña" = $${paramIndex++}`);
            values.push(usuario.contraseña);
        }

        if (fields.length === 0) {
            throw new ErrorPersonalizado("No se proporcionaron campos para actualizar.", 400);
        }

        const queryUpdate = `UPDATE Usuario SET ${fields.join(", ")} WHERE id = $1 RETURNING *;`;

        values.unshift(usuario.id);
        console.log("Query de actualización:", queryUpdate);
        console.log("Valores de actualización:", values);
        const result: any = await executeQuery(queryUpdate, values);

        if (result.length === 0) {
            throw new ErrorPersonalizado("No se encontró el usuario para actualizar.", 404);
        }

        const usuarioActualizado: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            telefono: result[0].telefono,
        };

        return usuarioActualizado;
    }


} 