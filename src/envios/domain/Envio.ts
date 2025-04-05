import { ObjectId } from "mongodb";
import Paquete from "../../paquetes/domain/Paquete";
import Usuario from "../../usuarios/domain/Usuario";

export default interface Envio {
    id?: ObjectId;
    paquete: Paquete;
    trabajador : Usuario;
    fecha: Date;
    estado: string;
}