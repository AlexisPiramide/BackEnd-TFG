import PaqueteRepository from "../domain/paquetes.repository";
import Paquete from "../domain/Paquete";
import {generarID16AN} from "../../../idGenerator";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import usuariosRepository from "../../usuarios/domain/usuarios.repository";
import usuariosUsecases from "../../usuarios/application/usuarios.usecases";
import direccionesRepository from "../../direcciones/domain/direcciones.repository";
import DireccionesRepositoryPostgres from "../../direcciones/infraestructure/db/direcciones.repository.postgres";
import DireccionesUseCases from "../../direcciones/application/direcciones.usecases";


const usuariorepository: usuariosRepository = new usuariosRepositoryPostgres();
const usuariousecases = new usuariosUsecases(usuariorepository);


const direccionrepository: direccionesRepository = new DireccionesRepositoryPostgres();
const direccionesusecases = new DireccionesUseCases(direccionrepository);

export default class PaquetesUsecases{

    constructor(private paqueteRepository: PaqueteRepository) {}
    

    async postPaquete(paquete: Paquete): Promise<Paquete> {
        let result = true;
        while(result){
            const idGenerado = await generarID16AN(); 
            paquete.id = idGenerado;
            result = await this.paqueteRepository.comporbarID(idGenerado);
        }

        let direccion
        if(typeof paquete.direccion_destinatario != 'number') {
            direccion = await direccionesusecases.nuevaDireccion(paquete.direccion_destinatario);
            paquete.direccion_destinatario = direccion.id;
        }

        const paquetedb = await this.paqueteRepository.postPaquete(paquete);

        paquetedb.direccion_destinatario = direccion;

        if(typeof paquete.remitente === 'string') {
            const datos = await usuariousecases.getUsuario(paquete.remitente);
            paquetedb.remitente = datos;
        }
        if(typeof paquete.direccion_remitente === 'number') {
            const direccion = await direccionesusecases.getDireccionById(paquete.direccion_remitente);
            paquetedb.direccion_remitente = direccion;
        }

        return paquetedb
    }

    async getPaquete(id: string): Promise<Paquete> {
        const paquete = await this.paqueteRepository.getPaquete(id);
        console.log(paquete);
        if (typeof paquete.remitente === 'string') {
            const datos = await usuariousecases.getUsuario(paquete.remitente);
            paquete.remitente = datos;
        }

        if (typeof paquete.direccion_remitente === 'number') {
            const direccion = await direccionesusecases.getDireccionById(paquete.direccion_remitente);
            paquete.direccion_remitente = direccion;
        }

        if (typeof paquete.direccion_destinatario === 'number') {
            const direccion = await direccionesusecases.getDireccionById(paquete.direccion_destinatario);
            paquete.direccion_destinatario = direccion;
        }

        return paquete;
    }
}