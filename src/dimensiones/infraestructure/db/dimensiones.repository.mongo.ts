import { collections } from "../../../../context/mongo.db";
import Dimension from "../../domain/Dimension";
import DimensionesRepository from "../../domain/dimensiones.repository";

export default class DimensionesRepositoryMongo implements DimensionesRepository {
    
    async getDimensiones(): Promise<Dimension[]> {
        try {
            const result = await collections.dimensiones.find().toArray();
            
            if (!result) {throw new Error("Dimensiones not found");}
            console.log(result);
            
            return result.map((dimension) => ({
                id: dimension._id.toString(),
                nombre: dimension.nombre,
                ancho: dimension.ancho,
                alto: dimension.alto,
                largo: dimension.largo,
                peso: dimension.peso
            }));
        } catch (error) {
            console.log(error);
            throw new Error("Error al conectar a la base de datos");
        }
    }
	
}