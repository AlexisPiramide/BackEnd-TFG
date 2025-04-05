import PaquetesUsecases from "../../paquetes/application/paquetes.usecases";
import PaqueteRepository from "../../paquetes/domain/paquetes.repository";
import PaqueteRepositoryPostgres from "../../paquetes/infraestructure/db/paquetes.repository.postgres";
import usuariosUsecases from "../../usuarios/application/usuarios.usecases";
import Usuario from "../../usuarios/domain/Usuario";
import usuariosRepository from "../../usuarios/domain/usuarios.repository";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import envioRepository from "../domain/envios.repository";

const paqueterepository: PaqueteRepository = new PaqueteRepositoryPostgres();
const paqueteusecases = new PaquetesUsecases(paqueterepository);


const usuariorepository: usuariosRepository = new usuariosRepositoryPostgres();
const usuariousecases = new usuariosUsecases(usuariorepository);

export default class EnviosUseCases {
    constructor(private enviosrepository: envioRepository) {}

    async tracking(id: string, usuario: string,tipo: number) {

        const paquete = await paqueteusecases.getPaquete(id);
        const usuariodb = await usuariousecases.getUsuario(usuario)
        return await this.enviosrepository.tracking(paquete, usuariodb,tipo);
    }

    async getTracking(id: string) {
        return await this.enviosrepository.getTracking(id);
    }

}