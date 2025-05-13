import executeQuery from "../../../../context/postgres.db";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado";
import Usuario from "../../../usuarios/domain/Usuario";
import Sucursal from "../../domain/Sucursal";
import sucuralesRepository from "../../domain/sucursales.repository";

export default class sucursalesRepositoryPostgres implements sucuralesRepository {


    async getSucursales(): Promise<Sucursal[]> {

        try {
            const query = `SELECT * FROM sucursales`;
            const result = await executeQuery(query);

            if (!result) {
                throw new Error("Error al buscar las sucursales en la base de datos");
            }

            const sucursales: Sucursal[] = result.map((sucursal: any) => ({
                id: sucursal.id,
                nombre: sucursal.nombre,
                direccion: sucursal.direccion,
                telefono: sucursal.telefono,
            }));
            return sucursales;
        } catch (error) {
            throw new ErrorPersonalizado(`Error al buscar las sucursales`, error);
        }
    }

    async getSucursal(sucursal: string): Promise<Sucursal> {

        try {
            const query = `SELECT * FROM sucursales WHERE id = $1`;
            const result: any = await executeQuery(query, [sucursal]);

            if (!result) {
                throw new Error("Error al buscar la sucursal en la base de datos");
            }

            return {
                id: result[0].id,
                nombre: result[0].nombre,
                direccion: result[0].direccion,
                telefono: result[0].telefono,
            };

        } catch (error) {
            throw new ErrorPersonalizado(`Error al buscar las sucursales`, error);
        }
    }

    async crearSucursal(sucursal: Sucursal): Promise<Sucursal> {
        try {
            const query = `INSERT INTO sucursales (nombre, direccion, telefono) VALUES ($1, $2, $3) RETURNING *`;
            const result: any = await executeQuery(query, [sucursal.nombre, sucursal.direccion, sucursal.telefono]);

            if (!result) {
                throw new Error("Error al insertar la sucursal en la base de datos");
            }

            return {
                id: result[0].id,
                nombre: result[0].nombre,
                direccion: result[0].direccion,
                telefono: result[0].telefono,
            };
        } catch (error) {
            throw new ErrorPersonalizado(`Error al insertar la sucursal`, error);
        }
    }

    async crearTrabajador(trabajador: Usuario, sucursal: string): Promise<Usuario> {

        try {
            const query = `WITH inserted_user AS (
                                INSERT INTO Usuario (nombre, apellidos, correo, telefono, puesto, contraseña, sucursal, es_externo, es_admin)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, null, null)
                                RETURNING *
                            )
                            SELECT 
                                U.id AS usuario_id, U.nombre AS usuario_nombre, U.apellidos, U.correo, U.telefono AS usuario_telefono, 
                                U.puesto, U.es_externo, U.es_admin,
                                s.id AS sucursal_id, s.nombre AS sucursal_nombre, s.id_direccion, s.telefono AS sucursal_telefono
                            FROM inserted_user AS U
                            JOIN Sucursal AS s ON U.sucursal = s.id;`;

            const result: any = await executeQuery(query, [trabajador.nombre, trabajador.apellidos, trabajador.correo, trabajador.telefono, trabajador.puesto, trabajador.contraseña, sucursal]);
            if (!result) {
                throw new Error("Error al insertar el trabajador en la base de datos");
            }
            const trabajadordb: Usuario = {
                id: result[0].usuario_id,
                nombre: result[0].usuario_nombre,
                apellidos: result[0].apellidos,
                correo: result[0].correo,
                telefono: result[0].usuario_telefono,
                puesto: result[0].puesto,
                sucursal: {
                    id: result[0].sucursal_id,
                    nombre: result[0].sucursal_nombre,
                    direccion: result[0].id_direccion,
                    telefono: result[0].sucursal_telefono
                }

            }

            return trabajadordb;
        } catch (error) {
            throw new ErrorPersonalizado(`Error al insertar el trabajador`, error);
        }
    }

    async vincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Usuario> {

        try {
            const query = `BEGIN; 
            UPDATE Usuario SET sucursal = $1 WHERE id = $2; 
            SELECT U.id AS usuario_id, U.nombre AS usuario_nombre, U.apellidos, U.correo, U.telefono AS usuario_telefono, U.puesto, U.es_externo, U.es_admin, 
            s.id AS sucursal_id, s.nombre AS sucursal_nombre, s.id_direccion, s.telefono AS sucursal_telefono 
            FROM Usuario AS U 
            JOIN Sucursal AS s ON U.sucursal = s.id WHERE u.id = $2; 
            COMMIT;`;
            const result: any = await executeQuery(query, [sucursal, trabajador.id]);
            if (!result) {
                throw new Error("Error al vincular el trabajador a la sucursal en la base de datos");
            }

            const trabajadordb: Usuario = {
                id: result[0].usuario_id,
                nombre: result[0].usuario_nombre,
                apellidos: result[0].apellidos,
                correo: result[0].correo,
                telefono: result[0].usuario_telefono,
                puesto: result[0].puesto,
                sucursal: {
                    id: result[0].sucursal_id,
                    nombre: result[0].sucursal_nombre,
                    direccion: result[0].id_direccion,
                    telefono: result[0].sucursal_telefono
                }
            }

            return trabajadordb;
        }
        catch (error) {
            throw new ErrorPersonalizado(`Error al vincular el trabajador`, error);
        }
    }



}