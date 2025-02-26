import PaqueteRepository from "../domain/paquetes.repository";
import Paquete from "../domain/Paquete";
import {generarID16AN} from "../../../idGenerator";

export default class PaquetesUsecases{

    constructor(private paqueteRepository: PaqueteRepository) {}

    async postPaquete(paquete: Paquete): Promise<Paquete> {

        while(true){
            const idGenerado = await generarID16AN(); 
            try{
                await this.paqueteRepository.getPaquete(idGenerado);
            }catch(error){
                paquete.id = idGenerado;
                break;
            }
           
        }

        return await this.paqueteRepository.postPaquete(paquete);
    }
}