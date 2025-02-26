import executeQuery from "../../../../context/postgres.db";
import Paquete from "../../domain/Paquete";
import PaqueteRepository from "../../domain/paquetes.repository";

export default class PaqueteRepositoryPostgres implements PaqueteRepository {

    async postPaquete(pedido: Paquete): Promise<Paquete> {
        
        const query = `INSERT INTO paquetes (id, dimensiones) VALUES ('${pedido.id}', '${pedido.dimensiones.nombre}') RETURNING *`
        const result : any[] = await executeQuery(query)

        if(result.length === 0) {throw new Error('Error al insertar el pedido')}

        const pedidodb : Paquete = {
            id: result[0].id,
            dimensiones: result[0].dimensiones
        }

        return pedidodb
    }

    async getPaquete(id: string): Promise<Paquete> {
        const query = `SELECT id FROM paquetes WHERE id = '${id}'`
        const result : any[] = await executeQuery(query)

        if(result.length === 0) {throw new Error('Pedido no encontrado')}

        const pedidodb : Paquete = {
            id: result[0].id,
            dimensiones: result[0].dimensiones
        }

        return pedidodb
    }
    

}