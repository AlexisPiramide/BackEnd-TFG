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

import Usuario from "../../usuarios/domain/Usuario";
import envioRepository from "../../envios/domain/envios.repository";
import enviosrepositoryMongo from "../../envios/infraestructure/db/envios.repository.mongo";

const usuariorepository: usuariosRepository = new usuariosRepositoryPostgres();
const usuariousecases = new usuariosUsecases(usuariorepository);

const direccionrepository: direccionesRepository = new DireccionesRepositoryPostgres();
const direccionesusecases = new DireccionesUseCases(direccionrepository);

const enviorepository: envioRepository = new enviosrepositoryMongo();

export default class PaquetesUsecases{

    constructor(private paqueteRepository: PaqueteRepository, private enviorepository: envioRepository ) { }

    async postPaquete(paquete: Paquete,trabajador: Usuario): Promise<Paquete> {
        let result = true;
        while(result){
            const idGenerado = await generarID16AN(); 
            paquete.id = idGenerado;
            result = await this.paqueteRepository.comporbarID(idGenerado);
        }


        if(typeof paquete.destinatario !== 'string'){
            const dd = await usuariousecases.registrarUsuarioExterno(paquete.destinatario);
            paquete.destinatario = dd;
        }
        if(typeof paquete.remitente !== 'string'){
            const dr = await usuariousecases.registrarUsuarioExterno(paquete.remitente);
            paquete.remitente = dr;
        }

        if(typeof paquete.direccion_destinatario !== 'number'){
            const dd = await direccionesusecases.nuevaDireccionUsuario(paquete.destinatario,paquete.direccion_destinatario,true);
            paquete.direccion_destinatario = dd.id;
        }
        if(typeof paquete.direccion_remitente !== 'number'){
            const dr = await direccionesusecases.nuevaDireccionUsuario(paquete.remitente,paquete.direccion_remitente,true);
            paquete.direccion_remitente = dr.id;
        }
    
        paquete.precio = await this.paqueteRepository.calcularPrecio(paquete);

        const paquetedb = await this.paqueteRepository.postPaquete(paquete);

        const paqueteCompleto  = await this.getPaquete(paquetedb.id);

        const correo1 = (typeof paqueteCompleto.destinatario !== 'string' ) ? paqueteCompleto.destinatario.correo : "";
        const correo2 = (typeof paqueteCompleto.remitente !== 'string' ) ? paqueteCompleto.remitente.correo : "";

        await sendTrackingEmail(correo1, paqueteCompleto.id);
        await sendTrackingEmail(correo2, paqueteCompleto.id);

        const direccion_sucursal = await direccionesusecases.getDireccionSucursal(trabajador.sucursal.id);

        const tracking = await this.enviorepository.tracking(paquetedb.id, trabajador.id, 0,direccion_sucursal);
        console.log(tracking);
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

            // Si 'paquete' es un objeto (Paquete), lo pasamos a la función de repositorio
            if (typeof paquete === "object" && paquete !== null) {
                return await this.paqueteRepository.calcularPrecio(paquete);
            }
    
            // Si 'paquete' es un string (tamaño) y 'peso' está definido
            if (typeof paquete === "string" && peso !== undefined) {
                return await this.paqueteRepository.calcularPrecio(paquete, peso);
            }
    
            throw new ErrorPersonalizado('Datos de entrada no válidos', 400);
        } catch (error) {
            console.log(error);
            throw new ErrorPersonalizado('Error al calcular el precio', 400);
        }
    }

    async terminarPaquete(id: string): Promise<Paquete> {
        const paquete = await this.paqueteRepository.terminarPaquete(id);
        if(!paquete) {
            throw new ErrorPersonalizado('Error al terminar el paquete', 400);
        }
        return paquete;
    }
    
}
