
import DireccionesUseCases from "../../direcciones/application/direcciones.usecases";
import Direccion from "../../direcciones/domain/Direccion";
import direccionesRepository from "../../direcciones/domain/direcciones.repository";
import DireccionesRepositoryPostgres from "../../direcciones/infraestructure/db/direcciones.repository.postgres";
import PaquetesUsecases from "../../paquetes/application/paquetes.usecases";
import PaqueteRepository from "../../paquetes/domain/paquetes.repository";
import PaqueteRepositoryPostgres from "../../paquetes/infraestructure/db/paquetes.repository.postgres";
import usuariosUsecases from "../../usuarios/application/usuarios.usecases";

import Usuario from "../../usuarios/domain/Usuario";
import usuariosRepository from "../../usuarios/domain/usuarios.repository";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import Envio from "../domain/Envio";
import envioRepository from "../domain/envios.repository";
import enviosrepositoryMongo from "../infraestructure/db/envios.repository.mongo";


const usuariorepository: usuariosRepository = new usuariosRepositoryPostgres();
const usuariousecases = new usuariosUsecases(usuariorepository);
const enviorepository: envioRepository = new enviosrepositoryMongo();
const paqueterepository: PaqueteRepository = new PaqueteRepositoryPostgres();

const paqueteusecases = new PaquetesUsecases(paqueterepository, enviorepository);

const direccionrepository: direccionesRepository = new DireccionesRepositoryPostgres();
const direccionesusecases = new DireccionesUseCases(direccionrepository);

export default class EnviosUseCases {
    constructor(private enviosrepository: envioRepository) { }

    async tracking(id: string, usuario: string, tipo: number, direccion: Direccion): Promise<Envio> {

        const paquete = await paqueteusecases.getPaquete(id);
        const usuariodb: Usuario = await usuariousecases.getUsuario(usuario);
        const result = await this.enviosrepository.tracking(paquete, usuariodb, tipo, direccion);

        if (!result) {
            throw new Error("Error al registrar el envío");
        }

        if (tipo === 3 || tipo === 4) {
            const paqueteTerminado = await paqueteusecases.terminarPaquete(id);

            const direccion1 = paqueteTerminado.direccion_destinatario as number;
            const direccion2 = paqueteTerminado.direccion_remitente as number;

            if (!paqueteTerminado) {
                throw new Error("Error al terminar el paquete");
            }

            try {
                const elimiarDireccionTemporal = await direccionesusecases.eliminarDireccion(direccion1);
                const elimiarDireccionTemporal2 = await direccionesusecases.eliminarDireccion(direccion2);
            } catch (error) {
                
            }
        }

        return result
    }

    async getTracking(id: string): Promise<Envio[]> {
        return await this.enviosrepository.getTracking(id);
    }

}