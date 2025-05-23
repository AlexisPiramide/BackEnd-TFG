
import Direccion from "../../direcciones/domain/Direccion";
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


const usuariorepository : usuariosRepository = new usuariosRepositoryPostgres();
const usuariousecases = new usuariosUsecases(usuariorepository);
const enviorepository: envioRepository = new enviosrepositoryMongo();
const paqueterepository: PaqueteRepository = new PaqueteRepositoryPostgres();

const paqueteusecases = new PaquetesUsecases(paqueterepository,enviorepository);


/*
import DireccionesUseCases from "../../direcciones/application/direcciones.usecases";
import direccionesRepository from "../../direcciones/domain/direcciones.repository";
import DireccionesRepositoryPostgres from "../../direcciones/infraestructure/db/direcciones.repository.postgres";

const direccionesrepository: direccionesRepository = new DireccionesRepositoryPostgres();
const direccionesusecases = new DireccionesUseCases(direccionesrepository);
*/
export default class EnviosUseCases {
    constructor(private enviosrepository: envioRepository) { }

    async tracking(id: string, usuario: string, tipo: number, direccion: Direccion): Promise<Envio> {

        const paquete = await paqueteusecases.getPaquete(id);
        const usuariodb: Usuario = await usuariousecases.getUsuario(usuario);
        const result = await this.enviosrepository.tracking(paquete, usuariodb, tipo,direccion);
        
        // Elimina direcciones temporales, seguramente lo elimine

        /* 
        let direccion_destinatario, direccion_remitente;
        
        if (result && tipo === 3){
            typeof paquete.direccion_destinatario === 'object' ? direccion_destinatario = await direccionesusecases.getDireccionById(paquete.direccion_destinatario.id): '';
            typeof paquete.direccion_remitente === 'object' ? direccion_remitente = await direccionesusecases.getDireccionById(paquete.direccion_remitente.id): '';

            const result1 = await direccionesusecases.eliminarDireccion(direccion_destinatario.id);
            const result2 = await direccionesusecases.eliminarDireccion(direccion_remitente.id);

            if(!result1 || !result2) {
                throw new Error("Error al eliminar la direccion");
            }
        }
        */
        return result
    }

    async getTracking(id: string): Promise<Envio[]> {
        return await this.enviosrepository.getTracking(id);
    }

}