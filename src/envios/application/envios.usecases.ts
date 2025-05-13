import PaquetesUsecases from "../../paquetes/application/paquetes.usecases";
import PaqueteRepository from "../../paquetes/domain/paquetes.repository";
import PaqueteRepositoryPostgres from "../../paquetes/infraestructure/db/paquetes.repository.postgres";

import Usuario from "../../usuarios/domain/Usuario";
import envioRepository from "../domain/envios.repository";

const paqueterepository: PaqueteRepository = new PaqueteRepositoryPostgres();
const paqueteusecases = new PaquetesUsecases(paqueterepository);


export default class EnviosUseCases {
    constructor(private enviosrepository: envioRepository) {}

    async tracking(id: string, usuario: Usuario,tipo: number) {
        const paquete = await paqueteusecases.getPaquete(id);
        return await this.enviosrepository.tracking(paquete, usuario,tipo);
    }

    async getTracking(id: string) {
        return await this.enviosrepository.getTracking(id);
    }

}