import { collections } from "../../../../context/mongo.db";
import Dimension from "../../domain/Dimension";
import DimensionesRepository from "../../domain/dimensiones.repository";

export default class DimensionesRepositoryMongo implements DimensionesRepository {
    
    async getDimensiones(): Promise<Dimension[]> {
        
        const dimensiones: Dimension[] = [];

        const result = await collections.dimensiones.find().toArray();

        result.forEach((dimension) => {
            dimensiones.push({
                id: dimension.id,
                nombre: dimension.nombre,
                ancho: dimension.ancho,
                alto: dimension.alto,
                largo: dimension.largo,
                peso: dimension.peso
            });
        });

        return dimensiones;
    }
	
}