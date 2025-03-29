import Usuario from "../../usuarios/domain/Usuario";
import envioRepository from "../domain/envios.repository";

export default class EnviosUseCases {
    constructor(private enviosrepository: envioRepository) {}

    async getEnvio(id: number) {
        return await this.enviosrepository.getEnvio(id);
    }

    async postEnvio(paquete: string, usuario: string) {
        return await this.enviosrepository.postEnvio(paquete, usuario);
    }

    async tracking(id: number, usuario: Usuario) {
        return await this.enviosrepository.tracking(id, usuario);
    }
}