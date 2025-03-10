import Usuario from "../../usuarios/domain/Usuario"
import Sucursal from "./Sucursal"

export default interface sucuralesRepository{
    
    crearSucursal(sucursal: Sucursal): Promise<Sucursal>
    getSucursales(): Promise<Sucursal[]>
    getSucursal(sucursal: string): Promise<Sucursal>

    crearTrabajador(trabajador: Usuario): Promise<Usuario>
    vincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean>
    desvincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean>
}