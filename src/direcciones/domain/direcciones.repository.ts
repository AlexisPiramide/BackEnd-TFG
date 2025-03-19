import Usuario from "../../usuarios/domain/Usuario";
import Direccion from "./Direccion";

export default interface direccionesRepository {

    getDireccionesUsuario(id: string): Promise<Direccion[]>;
    getDireccionById(id: number): Promise<Direccion>;
    nuevaDireccion(direccion: Direccion): Promise<Direccion>;
    nuevaDireccionUsuario(usuario:string,direccion: Direccion): Promise<Direccion>;
    updateDireccion(direccion: Direccion): Promise<Direccion>;
    eliminarDireccion(id: number): Promise<Direccion>;

}
