import executeQuery from "../../../../context/postgres.db";
import Paquete from "../../domain/Paquete";
import PaqueteRepository from "../../domain/paquetes.repository";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado"


import dimensionesUsecases from "./../../../dimensiones/application/dimensiones.usecases";
import DimensionesRepository from "./../../../dimensiones/domain/dimensiones.repository";
import DimensionesRepositoryMongo from "./../../../dimensiones/infraestructure/db/dimensiones.repository.mongo";

const dimensionesrepository: DimensionesRepository = new DimensionesRepositoryMongo();
const dimensionesusecases = new dimensionesUsecases(dimensionesrepository);

export default class PaqueteRepositoryPostgres implements PaqueteRepository {

    async postPaquete(paquete: Paquete): Promise<Paquete> {
        const query = `
                INSERT INTO paquete (id,id_dimension, peso, remitente, direccion_remitente, destinatario, direccion_destinatario,precio)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;

        try {

            const result: any[] = await executeQuery(query, [
                paquete.id,
                paquete.dimensiones,
                paquete.peso,
                paquete.remitente,
                paquete.direccion_remitente,
                paquete.destinatario,
                paquete.direccion_destinatario,
                paquete.precio
            ]);

            if (result.length === 0) {
                throw new ErrorPersonalizado('Error al insertar el paquete', 400);
            }

            const paqueteDb: Paquete = {
                id: result[0].id,
                dimensiones: result[0].id_dimension,
                peso: result[0].peso,
                remitente: result[0].remitente,
                direccion_remitente: result[0].direccion_remitente,
                destinatario: result[0].destinatario,
                direccion_destinatario: result[0].direccion_destinatario,
                precio: result[0].precio,
                fecha: result[0].fecha
            };

            return paqueteDb;
        } catch (error) {
            throw new ErrorPersonalizado('La conexión a la base de datos no ha funcionado', 500);
        }
    }

    async getPaquete(id: string): Promise<Paquete> {

        const query = `SELECT * FROM paquete WHERE id = '${id}'`
        try {
            const result: any[] = await executeQuery(query)

            if (result.length === 0) { throw new ErrorPersonalizado('Error al buscar paquete', 400) }

            const pedidodb: Paquete = {
                id: result[0].id,
                dimensiones: result[0].id_dimension,
                peso: result[0].peso,
                remitente: result[0].remitente,
                direccion_remitente: result[0].direccion_remitente,
                destinatario: result[0].destinatario,
                direccion_destinatario: result[0].direccion_destinatario,
                precio: result[0].precio,
                fecha: result[0].fecha
            }

            return pedidodb
        } catch {
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado', 500)
        }

    }

    async comporbarID(id: string): Promise<boolean> {
        const query = `SELECT id FROM paquete WHERE id = '${id}'`
        try {
            const result: any[] = await executeQuery(query)
            return (result.length === 0) ? false : true
        } catch {
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado', 500)
        }
    }

    async calcularPrecio(paquete: Paquete | string, peso?: number): Promise<number> {
        const tarifaBase = [5.63, 6.05, 7.37, 12.6];
        const tarifa100G = [0.5, 0.4, 0.3, 0.2];
    
        try {
            // Handle the case where paquete is a Paquete object
            if (paquete instanceof Object) {
                const dimensiones = await dimensionesusecases.getDimensiones();
                const dimension = dimensiones.find((dimension) => dimension.id === paquete.dimensiones);
    
                switch (dimension.nombre) {
                    case "Pequeño":
                        return tarifaBase[0] + (paquete.peso - 1) * tarifa100G[0];
                    case "Mediano":
                        return tarifaBase[1] + (paquete.peso - 1) * tarifa100G[1];
                    case "Grande":
                        return tarifaBase[2] + (paquete.peso - 1) * tarifa100G[2];
                    case "Extra grande":
                        return tarifaBase[3] + (paquete.peso - 1) * tarifa100G[3];
                }
            }
    
        
            if (typeof paquete === "string" && peso !== undefined) {
                switch (paquete) {
                    case "Pequeño":
                        return tarifaBase[0] + (peso - 1) * tarifa100G[0];
                    case "Mediano":
                        return tarifaBase[1] + (peso - 1) * tarifa100G[1];
                    case "Grande":
                        return tarifaBase[2] + (peso - 1) * tarifa100G[2];
                    case "Extra grande":
                        return tarifaBase[3] + (peso - 1) * tarifa100G[3];
                }
            }
            
            throw new ErrorPersonalizado('Datos de entrada no válidos', 400);
        } catch (error) {
            throw new ErrorPersonalizado('Error al calcular el precio', 400);
        }
    }
    
}