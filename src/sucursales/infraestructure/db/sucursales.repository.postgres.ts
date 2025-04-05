import executeQuery from "../../../../context/postgres.db";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado";
import Sucursal from "../../domain/Sucursal";
import sucuralesRepository from "../../domain/sucursales.repository";

export default class sucursalesRepositoryPostgres implements sucuralesRepository{
    
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
        }catch (error) {
            throw new ErrorPersonalizado(`Error al buscar las sucursales`, error);
        }
    }

    async getSucursal(sucursal: string): Promise<Sucursal> {
       
        try {
            const query = `SELECT * FROM sucursales WHERE id = $1`;
            const result : any = await executeQuery(query, [sucursal]);
            
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

}