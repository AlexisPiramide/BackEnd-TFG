import Paquete from "../../paquetes/domain/Paquete";
import Usuario from "../../usuarios/domain/Usuario";
import Envio from "./Envio";

export default interface envioRepository{
    tracking(id:number, usuario:Usuario): Promise<Envio>;
}

