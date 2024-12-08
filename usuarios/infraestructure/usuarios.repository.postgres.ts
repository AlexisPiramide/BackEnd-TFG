import Usuario from "../domain/Usuario";
import usuariosRepository from "../domain/usuarios.repository";
import executeQuery from "../../context/postgres.conector";
import { DatabaseError } from "pg";

export default class UsuariosRepositoryPostgres implements usuariosRepository {
    
    async login(email: string, password: string): Promise<Usuario> {
        try{
            const query = `SELECT * FROM usuarios WHERE email = $1`;
            const result: any[] = await executeQuery(query, [email]);
            
            const usuario: Usuario = {
                nombre: result[0].nombre,
                apellidos: result[0].apellidos,
                email: result[0].email,
                contraseña: result[0].contraseña,
                rol: result[0].rol
            };
            return usuario;

        } catch (error) {
            if (error instanceof DatabaseError) {
                throw new Error(`Error en la base de datos: ${error.message}`);
            } else {
                throw new Error(`Error inesperado: ${error.message}`);
            }
        }

    }
    async registro(usuario: Usuario): Promise<Usuario> {
       try{
            const query = `INSERT INTO usuarios (nombre, apellidos, email, contraseña, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const result: any[] = await executeQuery(query, [usuario.nombre, usuario.apellidos, usuario.email, usuario.contraseña, usuario.rol]);
            
            const usuarioRegistrado: Usuario = {
                nombre: result[0].nombre,
                apellidos: result[0].apellidos,
                email: result[0].email,
                contraseña: result[0].contraseña,
                rol: result[0].rol
            };
            return usuarioRegistrado;

        } catch (error) {
            if (error instanceof DatabaseError) {
                throw new Error(`Error en la base de datos: ${error.message}`);
            } else {
                throw new Error(`Error inesperado: ${error.message}`);
            }
       }
    }
}
