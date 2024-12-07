import { DatabaseError } from "pg";
import executeQuery from "../../../context/postgres.conector";
import Tipo from "../../domain/Tipo";
import tiposRepository from "../../domain/tipos.repository";

export default class TipoRepositoryPostgres implements tiposRepository {
    
    async getAll(): Promise<Tipo[]> {
        try{
            const query = `SELECT * FROM tipos`;
            const result = await executeQuery(query);
            const tipos: Tipo[] = result.map((tipo: any) => {
                return {
                    nombre: tipo.nombre,
                    descripcion: tipo.descripcion,
                    precioBase: tipo.precioBase
                };
            });
            return tipos;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw new Error(`Error en la base de datos: ${error.message}`);
            } else {
                throw new Error(`Error inesperado: ${error.message}`);
            }
        }

    
    }

}
