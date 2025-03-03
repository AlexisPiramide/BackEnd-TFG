import PaqueteRepository from "../domain/paquetes.repository";
import Paquete from "../domain/Paquete";
import {generarID16AN} from "../../../idGenerator";

export default class PaquetesUsecases{

    constructor(private paqueteRepository: PaqueteRepository) {}

    async postPaquete(paquete: Paquete): Promise<Paquete> {
        let result = true;
        while(result){
            const idGenerado = await generarID16AN(); 
            paquete.id = idGenerado;
            result = await this.paqueteRepository.comporbarID(idGenerado);
        }

        return await this.paqueteRepository.postPaquete(paquete);
    }
}