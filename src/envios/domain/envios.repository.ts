import Paquete from "../../paquetes/domain/Paquete";
import Usuario from "../../usuarios/domain/Usuario";
import Envio from "./Envio";

export default interface envioRepository{
    tracking(paquete: Paquete, usuario:Usuario,tipo: number): Promise<Envio>;

    getTracking(id: string): Promise<Envio[]>;
}

