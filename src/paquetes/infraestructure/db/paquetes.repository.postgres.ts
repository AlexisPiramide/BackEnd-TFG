import executeQuery from "../../../../context/postgres.db";
import Paquete from "../../domain/Paquete";
import PaqueteRepository from "../../domain/paquetes.repository";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado"
export default class PaqueteRepositoryPostgres implements PaqueteRepository {


        async postPaquete(paquete: Paquete): Promise<Paquete> {
            const query = `
                INSERT INTO paquete (id,id_dimension, peso, remitente, direccion_remitente, destinatario, direccion_destinatario)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
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
                    paquete.direccion_destinatario
                ]);
        
                if (result.length === 0) {
                    throw new ErrorPersonalizado('Error al insertar el paquete', 400);
                }
        
                const paqueteDb: Paquete = {
                    id: result[0].id,
                    dimensiones: result[0].id_dimension,
                    peso: result[0].peso,
                    remitente: result[0].remitente ,
                    direccion_remitente:result[0].direccion_remitente ,
                    destinatario:result[0].destinatario ,
                    direccion_destinatario: result[0].direccion_destinatario
                };
        
                return paqueteDb;
            } catch (error) {
                throw new ErrorPersonalizado('La conexión a la base de datos no ha funcionado', 500);
            }
        }

    async getPaquete(id: string): Promise<Paquete> {

        const query = `SELECT id FROM paquete WHERE id = '${id}'`
        try{
            const result : any[] = await executeQuery(query)

            if(result.length === 0) {throw new ErrorPersonalizado('Error al buscar paquete',400)}
    
            const pedidodb : Paquete = {
                id: result[0].id,
                dimensiones: result[0].id_dimension,
                peso: result[0].peso,
                remitente: result[0].remitente ,
                direccion_remitente:result[0].direccion_remitente ,
                destinatario:result[0].destinatario ,
                direccion_destinatario: result[0].direccion_destinatario
            }
    
            return pedidodb
        }catch{
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado',500)
        }
        
    }
    
    async comporbarID(id: string): Promise<boolean> {
        const query = `SELECT id FROM paquete WHERE id = '${id}'`
        try {
            const result : any[] = await executeQuery(query)
            return (result.length === 0)? false: true        
        } catch{
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado',500)
        }
    }

}