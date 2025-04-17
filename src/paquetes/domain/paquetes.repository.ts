import Paquete from "./Paquete";

export default interface PaqueteRepository {
    getPaquete(id: string): Promise<Paquete>;
    postPaquete(paquete: Paquete): Promise<Paquete>;
    getPaquetesByUsuario(id: string): Promise<Paquete[]>;
    comporbarID(id:string): Promise<boolean>;

    calcularPrecio(paquete: Paquete): Promise<number>;
    calcularPrecio(tamaño: string, peso: number): Promise<number>;
}