//import Usuario from "../../usuarios/domain/Usuario"
import Sucursal from "./Sucursal"

export default interface sucuralesRepository{
    

    getSucursales(): Promise<Sucursal[]>
    getSucursal(sucursal: string): Promise<Sucursal>
    crearSucursal(sucursal: Sucursal): Promise<Sucursal>

    //crearTrabajador(trabajador: Usuario,sucursal: string): Promise<Usuario>
    //vincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean>
    //desvincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean>
}