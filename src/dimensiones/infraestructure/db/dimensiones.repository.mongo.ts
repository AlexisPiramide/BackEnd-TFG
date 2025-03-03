import { collections } from "../../../../context/mongo.db";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado";
import Dimension from "../../domain/Dimension";
import DimensionesRepository from "../../domain/dimensiones.repository";

export default class DimensionesRepositoryMongo implements DimensionesRepository {
    
    async getDimensiones(): Promise<Dimension[]> {
        try {
            const result = await collections.dimensiones.find({}).toArray();

            if (!result) {throw new ErrorPersonalizado('Error al buscar dimensiones',400)}

            return result.map((dimension) => ({
                id: dimension._id.toString(),
                nombre: dimension.nombre,
                ancho: dimension.ancho,
                alto: dimension.alto,
                largo: dimension.largo,
                peso: dimension.peso
            }));
        } catch (error) {
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado',500)
        }
    }
	
}