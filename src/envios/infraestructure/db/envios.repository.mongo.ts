import { collections } from "../../../../context/mongo.db";
import Paquete from "../../../paquetes/domain/Paquete";
import Usuario from "../../../usuarios/domain/Usuario";
import Envio from "../../domain/Envio";
import envioRepository from "../../domain/envios.repository";

export default class enviosrepositoryMongo implements envioRepository {
    async tracking(paquete: Paquete, usuario: Usuario, tipo: number): Promise<Envio> {

        const estados = ["Registrado ", "En tránsito", "No recogido", "Entregado", "Cancelado"];
        const estado = estados[tipo];

        const envio: Envio = {
            paquete: paquete,
            fecha: new Date(),
            estado: estado,
            trabajador: usuario
        };
        const result = await collections.envios.insertOne(envio);
        if (!result) {
            throw new Error("Error al insertar el envio en la base de datos");
        }
        const resultGet = await collections.envios.findOne({ _id: result.insertedId });
        if (!resultGet) {
            throw new Error("Error al buscar el envio en la base de datos");
        }

        const enviodb: Envio = {
            id: resultGet._id,
            paquete: resultGet.paquete,
            fecha: resultGet.fecha,
            estado: resultGet.estado,
            trabajador: resultGet.trabajador
        };
        if (!enviodb) {
            throw new Error("Error al buscar el envio en la base de datos");
        }

        return enviodb;

    }

    async getTracking(id: string): Promise<Envio[]> {
        const result = await collections.envios.find({ paquete: id }).toArray();
        if (!result) {
            throw new Error("Error al buscar el envio en la base de datos");
        }
        return result.map((envio) => ({
            id: envio._id,
            paquete: envio.paquete,
            fecha: envio.fecha,
            estado: envio.estado,
            trabajador: envio.trabajador
        }));
    }
}