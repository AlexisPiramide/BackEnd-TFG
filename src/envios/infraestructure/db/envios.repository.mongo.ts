import Usuario from "../../../usuarios/domain/Usuario";
import Envio from "../../domain/Envio";
import envioRepository from "../../domain/envios.repository";

export default class enviosrepositoryMongo implements envioRepository{
    
    async tracking(id: number, usuario: Usuario): Promise<Envio> {
        throw new Error("Method not implemented.");
    }

}