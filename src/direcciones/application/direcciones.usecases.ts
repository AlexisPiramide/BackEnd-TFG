import DireccionesRepository from "../domain/direcciones.repository";
import Direccion from "../domain/Direccion"; // Assuming Direccion is defined in this path

export default class DireccionesUseCases {
    constructor(private direccionesRepository: DireccionesRepository) { }

    async getDireccionesUsuario(id: string) {
        return await this.direccionesRepository.getDireccionesUsuario(id);
    }
    async getDireccionById(id: number): Promise<Direccion> {
        return await this.direccionesRepository.getDireccionById(id);
    }

    async nuevaDireccion(direccion: Direccion,es_temporal:boolean): Promise<Direccion> {
        return await this.direccionesRepository.nuevaDireccion(direccion,es_temporal);
    }

    async nuevaDireccionUsuario(usuario: string, direccion: Direccion,es_temporal:boolean): Promise<Direccion> {
        return await this.direccionesRepository.nuevaDireccionUsuario(usuario, direccion,es_temporal);
    }

    async updateDireccion(direccion: Direccion): Promise<Direccion> {
        return await this.direccionesRepository.updateDireccion(direccion);
    }

    async eliminarDireccion(id: number): Promise<Direccion> {

        const enUso = this.direccionesRepository.comprobarEstaEnUso(id);

        if (enUso) {
            return await this.direccionesRepository.alterarDireccionTemporal(id, true);
        }else{
            return await this.direccionesRepository.eliminarDireccion(id);
        } 
    }

    async getDireccionSucursal(id: string): Promise<Direccion> {
        return await this.direccionesRepository.getDireccionSucursal(id);
    }
}
