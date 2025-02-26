import Paquete from "./Paquete";

export default interface PaqueteRepository {
    getPaquete(id: string): Promise<Paquete>;
    postPaquete(paquete: Paquete): Promise<Paquete>;
}