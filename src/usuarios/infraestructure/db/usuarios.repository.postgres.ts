import executeQuery from "../../../../context/postgres.db";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado";
import Usuario from "../../domain/Usuario";
import usuariosRepository from "../../domain/usuarios.repository";

export default class usuariosRepositoryPostgres implements usuariosRepository{

    
    async login(usuario: Usuario): Promise<Usuario> {

        const queryLogin = 'SELECT * FROM Usuario WHERE correo = $1';
        const values = [usuario.correo];
        
        const result: any = await executeQuery(queryLogin, values);
    
        if(result.length === 0) {
            throw new ErrorPersonalizado("Usuario no encontrado", 404);
        }
    
        const usuarioDB: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            contraseña: result[0].password,
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
                nombre: resultSucursal[0].nombre,
                direccion: resultSucursal[0].direccion,
            };
        }
    
        return usuarioDB;
    }
    

    async registro(usuario: Usuario): Promise<Usuario> {
        const queryRegistro = 'INSERT INTO Usuario (id,nombre, correo, password,apellidos,telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [usuario.id,usuario.nombre, usuario.correo, usuario.contraseña,usuario.apellidos,usuario.telefono];
        
        const result: any = await executeQuery(queryRegistro, values);

        if(result.length === 0){
            throw new ErrorPersonalizado("Error al registrar el usuario", 500);
        }

        const usuarioRegistrado: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            contraseña: result[0].password,
            telefono: result[0].telefono,
        }

        return usuarioRegistrado;
    }

    async comporbarID(idGenerado: string): Promise<boolean> {
        const queryComprobarID = 'SELECT * FROM Usuario WHERE id = $1';
        const values = [idGenerado];
        const result: any = await executeQuery(queryComprobarID, values);
        if(result.length === 0){
            return false;
        }
        return true;
    }

    async getUsuario(id: string): Promise<Usuario> {
        const queryGetUsuario = 'SELECT * FROM Usuario WHERE id = $1';
        const values = [id];
        const result: any = await executeQuery(queryGetUsuario, values);

        if(result.length === 0){
            throw new ErrorPersonalizado("Usuario no encontrado", 404);
        }

        const usuarioDB: Usuario = {
            id: result[0].id,
            nombre: result[0].nombre,
            apellidos: result[0].apellidos,
            correo: result[0].correo,
            contraseña: result[0].password,
            telefono: result[0].telefono,
        };

        return usuarioDB;
    }
}