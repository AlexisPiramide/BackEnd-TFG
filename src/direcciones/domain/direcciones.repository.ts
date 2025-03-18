import Usuario from "../../usuarios/domain/Usuario";
import Direccion from "./Direccion";

export default interface direccionesRepository {

    getDireccionesUsuario(usuario: Usuario): Promise<Direccion[]>;
    getDireccionById(id: number): Promise<Direccion>;
    nuevaDireccion(direccion: Direccion): Promise<Direccion>;
    nuevaDireccionUsuario(usuario:Usuario,direccion: Direccion): Promise<Direccion>;
    updateDireccion(direccion: Direccion): Promise<Direccion>;
    eliminarDireccion(id: number): Promise<Direccion>;

}
