import { ObjectId } from "mongodb";
import Paquete from "../../paquetes/domain/Paquete";
import Usuario from "../../usuarios/domain/Usuario";
import Direccion from "../../direcciones/domain/Direccion";

export default interface Envio {
    id?: ObjectId;
    paquete: Paquete;
    trabajador : Usuario;
    fecha: Date;
    estado: string;
    direccion?: Direccion;
}