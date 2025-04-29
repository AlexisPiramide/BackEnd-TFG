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
        let destinatario, remitente;
        destinatario = (typeof paquete.destinatario !== 'string') ? (await usuariousecases.registrarUsuarioExterno(paquete.destinatario)).id  : await usuariousecases.getUsuario(paquete.destinatario);
        remitente = (typeof paquete.remitente !== 'string') ? (await usuariousecases.registrarUsuarioExterno(paquete.remitente)).id  : await usuariousecases.getUsuario(paquete.remitente);


        let direccion_destinatario,direccion_remitente;
        direccion_destinatario = (typeof paquete.direccion_destinatario !== 'string') ? 1 /* await usuariousecases.postUsuario_Externo(paquete.destinatario);*/  : direccionesusecases.nuevaDireccion(paquete.direccion_destinatario);;
        direccion_remitente = (typeof paquete.direccion_remitente !== 'string') ? 1 /* await usuariousecases.postUsuario_Externo(paquete.remitente);*/  : direccionesusecases.nuevaDireccion(paquete.direccion_remitente);;
        
        paquete.destinatario = destinatario.id;
        paquete.remitente = paquete.id;
        paquete.direccion_destinatario = direccion_destinatario.id;
        paquete.direccion_remitente = direccion_remitente.id;
    
        paquete.precio = await this.paqueteRepository.calcularPrecio(paquete);

        const paquetedb = await this.paqueteRepository.postPaquete(paquete);


        //Esta parte solo da los datos completos;
        if (typeof paquete.destinatario === 'string') {
            paquetedb.destinatario = await usuariousecases.getUsuario(paquete.destinatario);
        }

        if(typeof paquete.remitente === 'string') {
            paquetedb.remitente = await usuariousecases.getUsuario(paquete.remitente);
        }

        if (typeof paquete.direccion_destinatario === 'number') {
            paquetedb.direccion_destinatario = await direccionesusecases.getDireccionById(paquete.direccion_destinatario);
        }
        if (typeof paquete.direccion_remitente === 'number') {
            paquetedb.direccion_remitente = await direccionesusecases.getDireccionById(paquete.direccion_remitente);
        }
        
        return paquetedb
    }

    async getPaquetesByUsuario(id: string): Promise<Paquete[]> {
        const paquetes = await this.paqueteRepository.getPaquetesByUsuario(id);
        for (const paquete of paquetes) {
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
        }

        return paquetes;
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