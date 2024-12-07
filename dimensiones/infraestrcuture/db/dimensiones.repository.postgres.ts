import { DatabaseError } from "pg";
import executeQuery from "../../../context/postgres.conector";
import Dimension from "../../domain/Dimension";
import dimensionesRepository from "../../domain/dimensiones.repository";

export default class DimensionesRepositoryPostgres implements dimensionesRepository{

    async getAll(): Promise<Dimension[]> {

        const query = `SELECT * FROM dimensiones`;

        try {
           
            const result = await executeQuery(query);
            
            const dimensiones: Dimension[] = result.map((dimension: any) => {
                return {
                    nombre: dimension.nombre,
                    descripcion: dimension.descripcion,
                    dimensiones: dimension.dimensiones,
                    peso: dimension.peso
                };
            });

            return dimensiones;

        } catch (error) {
            if (error instanceof DatabaseError) {
                throw new Error(`Error en la base de datos: ${error.message}`);
            } else {
                throw new Error(`Error inesperado: ${error.message}`);
            }
        }
    }

}