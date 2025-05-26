import Direccion from "./Direccion";

export default interface direccionesRepository {

    getDireccionesUsuario(id: string): Promise<Direccion[]>;
    getDireccionById(id: number): Promise<Direccion>;
    nuevaDireccion(direccion: Direccion,es_temporal:boolean): Promise<Direccion>;
    nuevaDireccionUsuario(usuario:string,direccion: Direccion,es_temporal:boolean): Promise<Direccion>;
    updateDireccion(direccion: Direccion): Promise<Direccion>;
    eliminarDireccion(id: number): Promise<Direccion>;

    alterarDireccionTemporal(id: number, es_temporal: boolean): Promise<Direccion>;
    comprobarEstaEnUso(id: number): Promise<boolean>;
    getDireccionSucursal(id: string): Promise<Direccion>;
}
