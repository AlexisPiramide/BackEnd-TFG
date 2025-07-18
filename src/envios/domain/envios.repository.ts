import Direccion from "../../direcciones/domain/Direccion";
import Paquete from "../../paquetes/domain/Paquete";
import Usuario from "../../usuarios/domain/Usuario";
import Envio from "./Envio";

export default interface envioRepository{
    tracking(paquete: Paquete | string, usuario:Usuario | string,tipo: number,direccion: Direccion): Promise<Envio>;

    getTracking(id: string): Promise<Envio[]>;
}

