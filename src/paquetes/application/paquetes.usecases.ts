import PaqueteRepository from "../domain/paquetes.repository";
import Paquete from "../domain/Paquete";
import {generarID16AN} from "../../../context/idGenerator";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import usuariosRepository from "../../usuarios/domain/usuarios.repository";
import usuariosUsecases from "../../usuarios/application/usuarios.usecases";
import direccionesRepository from "../../direcciones/domain/direcciones.repository";
import DireccionesRepositoryPostgres from "../../direcciones/infraestructure/db/direcciones.repository.postgres";
import DireccionesUseCases from "../../direcciones/application/direcciones.usecases";
import ErrorPersonalizado from "../../Error/ErrorPersonalizado";

import sendTrackingEmail from "../../../context/enviaCorreos";

import enviosRepositoryMongo from "../../envios/infraestructure/db/envios.repository.mongo";
import enviosUsecases from "../../envios/application/envios.usecases";
import enviosRepository from "../../envios/domain/envios.repository";
import Usuario from "../../usuarios/domain/Usuario";

const usuariorepository: usuariosRepository = new usuariosRepositoryPostgres();
const usuariousecases = new usuariosUsecases(usuariorepository);

const direccionrepository: direccionesRepository = new DireccionesRepositoryPostgres();
const direccionesusecases = new DireccionesUseCases(direccionrepository);

const enviorepository: enviosRepository = new enviosRepositoryMongo();
const enviousecases = new enviosUsecases(enviorepository);

class PaquetesUsecases{

    constructor(private paqueteRepository: PaqueteRepository) {}
    

    async postPaquete(paquete: Paquete,trabajador: Usuario): Promise<Paquete> {
        let result = true;
        while(result){
            const idGenerado = await generarID16AN(); 
            paquete.id = idGenerado;
            result = await this.paqueteRepository.comporbarID(idGenerado);
        }
        let destinatario, remitente;
        
        destinatario = (typeof paquete.destinatario !== 'string') ? (await usuariousecases.registrarUsuarioExterno(paquete.destinatario))  : await usuariousecases.getUsuario(paquete.destinatario);
        remitente = (typeof paquete.remitente !== 'string') ? (await usuariousecases.registrarUsuarioExterno(paquete.remitente))  : await usuariousecases.getUsuario(paquete.remitente);


        let direccion_destinatario,direccion_remitente;
        direccion_destinatario = (typeof paquete.direccion_destinatario !== 'number') ?  direccionesusecases.nuevaDireccionUsuario(destinatario.id,paquete.direccion_destinatario,true): direccionesusecases.getDireccionById(paquete.direccion_destinatario);
        direccion_remitente = (typeof paquete.direccion_remitente !== 'number') ? direccionesusecases.nuevaDireccionUsuario(remitente.id,paquete.direccion_remitente,true): direccionesusecases.getDireccionById(paquete.direccion_remitente);
        
        paquete.destinatario = destinatario.id;
        paquete.remitente = paquete.id;
        paquete.direccion_destinatario = direccion_destinatario.id;
        paquete.direccion_remitente = direccion_remitente.id;
    
        paquete.precio = await this.paqueteRepository.calcularPrecio(paquete);

        const paquetedb = await this.paqueteRepository.postPaquete(paquete);

        const paqueteCompleto  = await this.getPaquete(paquetedb.id);

        const correo1 = (typeof paqueteCompleto.destinatario !== 'string' ) ? paqueteCompleto.destinatario.correo : "";
        const correo2 = (typeof paqueteCompleto.remitente !== 'string' ) ? paqueteCompleto.remitente.correo : "";

        // Enviar correo de seguimiento a ambos usuarios
        await sendTrackingEmail(correo1, paqueteCompleto.id);
        await sendTrackingEmail(correo2, paqueteCompleto.id);

        enviousecases.tracking(paquetedb.id, trabajador, 0);
        return paqueteCompleto
    }

    async getPaquetesByUsuario(id: string): Promise<Paquete[]> {
        const paquetes = await this.paqueteRepository.getPaquetesByUsuario(id);

        return paquetes;
    }

    async getPaquete(id: string): Promise<Paquete> {
        const paquete = await this.paqueteRepository.getPaquete(id);
        return paquete;
    }
    
    async calcularPrecio(paquete: Paquete | string, peso?: number): Promise<number> {
        try {
            // Si 'paquete' es un objeto, lo pasamos a la función de repositorio
            if (paquete instanceof Object) {
                return await this.paqueteRepository.calcularPrecio(paquete);
            }
    
            // Si 'paquete' es un string (tamaño) y 'peso' está definido
            if (typeof paquete === "string" && peso !== undefined) {
                return await this.paqueteRepository.calcularPrecio(paquete, peso);
            }
    
            throw new ErrorPersonalizado('Datos de entrada no válidos', 400);
        } catch (error) {
            throw new ErrorPersonalizado('Error al calcular el precio', 400);
        }
    }
    
}

export default PaquetesUsecases;