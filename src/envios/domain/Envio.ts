import Paquete from "../../paquetes/domain/Paquete";

export default interface Envio {
    id: number;
    paquete: Paquete;
    coste: number;
    fechaCreaccion: Date;
    estado: string;
}