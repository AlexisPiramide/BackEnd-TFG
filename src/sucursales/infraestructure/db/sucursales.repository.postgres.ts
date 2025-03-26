import Usuario from "../../../usuarios/domain/Usuario";
import Sucursal from "../../domain/Sucursal";
import sucuralesRepository from "../../domain/sucursales.repository";

export default class sucursalesRepositoryPostgres implements sucuralesRepository{
    
    
    async crearSucursal(sucursal: Sucursal): Promise<Sucursal> {
        throw new Error("Method not implemented.");
    }

    async getSucursales(): Promise<Sucursal[]> {
        throw new Error("Method not implemented.");
    }

    async getSucursal(sucursal: string): Promise<Sucursal> {
        throw new Error("Method not implemented.");
    }

    async crearTrabajador(trabajador: Usuario): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }

    async vincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }

    async desvincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }

}