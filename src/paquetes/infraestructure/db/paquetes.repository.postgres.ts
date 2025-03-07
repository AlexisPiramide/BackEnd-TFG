import executeQuery from "../../../../context/postgres.db";
import Paquete from "../../domain/Paquete";
import PaqueteRepository from "../../domain/paquetes.repository";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado"
export default class PaqueteRepositoryPostgres implements PaqueteRepository {


    async postPaquete(paquete: Paquete): Promise<Paquete> {
        
        const query = `INSERT INTO paquetes (id, dimensiones) VALUES ('${paquete.id}', '${paquete.dimensiones.nombre}') RETURNING *`
        try{
        
        const result : any[] = await executeQuery(query)

        if(result.length === 0) {throw new ErrorPersonalizado('Error al insertar el pedido',400)}

        const pedidodb : Paquete = {
            id: result[0].id,
            dimensiones: result[0].dimensiones
        }

        return pedidodb
            
        }catch{
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado',500)
        }
    }

    async getPaquete(id: string): Promise<Paquete> {

        const query = `SELECT id FROM paquetes WHERE id = '${id}'`
        try{
            const result : any[] = await executeQuery(query)

            if(result.length === 0) {throw new ErrorPersonalizado('Error al buscar paquete',400)}
    
            const pedidodb : Paquete = {
                id: result[0].id,
                dimensiones: result[0].dimensiones
            }
    
            return pedidodb
        }catch{
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado',500)
        }
        
    }
    
    async comporbarID(id: string): Promise<boolean> {
        const query = `SELECT id FROM paquetes WHERE id = '${id}'`
        try {
            const result : any[] = await executeQuery(query)
            return (result.length === 0)? false: true        
        } catch{
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado',500)
        }
    }

}