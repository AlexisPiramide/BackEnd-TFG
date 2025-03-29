import Dimension from "../../dimensiones/domain/Dimension";
import Direccion from "../../direcciones/domain/Direccion";
import Usuario from "../../usuarios/domain/Usuario";

export default interface Paquete {
    id?: string;
    dimensiones: Dimension | string;
    remitente: Usuario | string;
    direccion_remitente?: Direccion | number;
    destinatario: string;
    direccion_destinatario: Direccion | number;
    peso: number;
    precio?: number;
    fecha?: Date;
}