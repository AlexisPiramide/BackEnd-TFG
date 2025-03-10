import Sucursal from "../../sucursales/domain/Sucursal";

export default interface Usuario {
    id?:string;
    nombre?: string;
    apellidos?: string;
    correo?: string;
    contraseña?: string;
    telefono?: string;
    sucursal?: Sucursal;
}
