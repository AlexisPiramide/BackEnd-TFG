import { collections } from "../../../../context/mongo.db";
import executeQuery from "../../../../context/postgres.db";
import Direccion from "../../../direcciones/domain/Direccion";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado";
import Paquete from "../../../paquetes/domain/Paquete";
import Usuario from "../../../usuarios/domain/Usuario";
import Envio from "../../domain/Envio";
import envioRepository from "../../domain/envios.repository";

export default class enviosrepositoryMongo implements envioRepository {
    async tracking(paquete: Paquete, usuario: Usuario, tipo: number, direccion: Direccion): Promise<Envio> {

        const estados = ["Registrado", "En tránsito", "No recogido", "Entregado", "Cancelado"];
        const estado = estados[tipo];
        let paquetedb: Paquete;
        let envio: Envio;
        if(typeof paquete == 'string'){
            paquetedb = await this.getPaquete(paquete);
            envio = {
                paquete: paquetedb ,
                fecha: new Date(),
                estado: estado,
                trabajador: usuario,
                direccion: direccion
            };
        }else{
            envio = {
                paquete: paquete ,
                fecha: new Date(),
                estado: estado,
                trabajador: usuario,
                direccion: direccion
            };
        }
       
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
        const result = await collections.envios.find({ "paquete.id": id }).toArray();
        if (!result) {
            throw new Error("Error al buscar el envio en la base de datos");
        }
        return result.map((envio) => ({
            id: envio._id,
            paquete: envio.paquete,
            fecha: envio.fecha,
            estado: envio.estado,
            trabajador: envio.trabajador,
            direccion: envio.direccion
        }));
    }

    async getPaquete(id: string): Promise<Paquete> {

        const query = `SELECT p.id AS paquete_id, p.id_dimension, p.peso, p.precio, ur.id AS remitente_id, ur.nombre AS remitente_nombre, ur.apellidos AS remitente_apellidos, ur.correo AS remitente_correo, ur.contraseña AS remitente_contraseña, ur.telefono AS remitente_telefono, sur.id AS remitente_sucursal_id, sur.nombre AS remitente_sucursal_nombre, dr.id AS direccion_remitente_id, dr.calle AS direccion_remitente_calle, dr.numero AS direccion_remitente_numero, dr.codigo_postal AS direccion_remitente_codigo_postal, dr.localidad AS direccion_remitente_localidad, dr.provincia AS direccion_remitente_provincia, ud.id AS destinatario_id, ud.nombre AS destinatario_nombre, ud.apellidos AS destinatario_apellidos, ud.correo AS destinatario_correo, ud.contraseña AS destinatario_contraseña, ud.telefono AS destinatario_telefono, sud.id AS destinatario_sucursal_id, sud.nombre AS destinatario_sucursal_nombre, dd.id AS direccion_destinatario_id, dd.calle AS direccion_destinatario_calle, dd.numero AS direccion_destinatario_numero, dd.codigo_postal AS direccion_destinatario_codigo_postal, dd.localidad AS direccion_destinatario_localidad, dd.provincia AS direccion_destinatario_provincia FROM Paquete p JOIN Usuario ur ON p.remitente = ur.id JOIN Direccion dr ON p.direccion_remitente = dr.id LEFT JOIN Sucursal sur ON ur.sucursal = sur.id JOIN Usuario ud ON p.destinatario = ud.id JOIN Direccion dd ON p.direccion_destinatario = dd.id LEFT JOIN Sucursal sud ON ud.sucursal = sud.id WHERE p.id = $1;`;
        const result: any[] = await executeQuery(query, [id]);

        if (result.length === 0) {
            throw new ErrorPersonalizado('Error al buscar paquete', 400);
        }

        const row = result[0];

        const direccionRemitente: Direccion = {
            id: row.direccion_remitente_id,
            calle: row.direccion_remitente_calle,
            numero: row.direccion_remitente_numero,
            codigoPostal: row.direccion_remitente_codigo_postal,
            localidad: row.direccion_remitente_localidad,
            provincia: row.direccion_remitente_provincia,
            pais: 'ES'
        };

        const direccionDestinatario: Direccion = {
            id: row.direccion_destinatario_id,
            calle: row.direccion_destinatario_calle,
            numero: row.direccion_destinatario_numero,
            codigoPostal: row.direccion_destinatario_codigo_postal,
            localidad: row.direccion_destinatario_localidad,
            provincia: row.direccion_destinatario_provincia,
            pais: 'ES'
        };

        const remitente: Usuario = {
            id: row.remitente_id,
            nombre: row.remitente_nombre,
            apellidos: row.remitente_apellidos,
            correo: row.remitente_correo,
            contraseña: row.remitente_contraseña || undefined,
            telefono: row.remitente_telefono || undefined,
        };

        const destinatario: Usuario = {
            id: row.destinatario_id,
            nombre: row.destinatario_nombre,
            apellidos: row.destinatario_apellidos,
            correo: row.destinatario_correo,
            contraseña: row.destinatario_contraseña || undefined,
            telefono: row.destinatario_telefono || undefined,
        };

        const paquete: Paquete = {
            id: row.paquete_id,
            dimensiones: row.id_dimension,
            peso: row.peso,
            precio: row.precio,
            remitente,
            direccion_remitente: direccionRemitente,
            destinatario,
            direccion_destinatario: direccionDestinatario
        };

        return paquete;

    }
}


