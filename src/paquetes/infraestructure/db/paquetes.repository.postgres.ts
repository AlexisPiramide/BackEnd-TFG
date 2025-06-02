import executeQuery from "../../../../context/postgres.db";
import Paquete from "../../domain/Paquete";
import PaqueteRepository from "../../domain/paquetes.repository";
import ErrorPersonalizado from "../../../Error/ErrorPersonalizado"


import dimensionesUsecases from "./../../../dimensiones/application/dimensiones.usecases";
import DimensionesRepository from "./../../../dimensiones/domain/dimensiones.repository";
import DimensionesRepositoryMongo from "./../../../dimensiones/infraestructure/db/dimensiones.repository.mongo";
import Direccion from "../../../direcciones/domain/Direccion";
import Usuario from "../../../usuarios/domain/Usuario";

const dimensionesrepository: DimensionesRepository = new DimensionesRepositoryMongo();
const dimensionesusecases = new dimensionesUsecases(dimensionesrepository);

export default class PaqueteRepositoryPostgres implements PaqueteRepository {

    async postPaquete(paquete: Paquete): Promise<Paquete> {
        const query = `
                INSERT INTO paquete (id,id_dimension, peso, remitente, direccion_remitente, destinatario, direccion_destinatario,precio)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;
        try {

            const result: any[] = await executeQuery(query, [
                paquete.id,
                paquete.dimensiones,
                paquete.peso,
                paquete.remitente,
                paquete.direccion_remitente,
                paquete.destinatario,
                paquete.direccion_destinatario,
                paquete.precio
            ]);

            if (result.length === 0) {
                throw new ErrorPersonalizado('Error al insertar el paquete', 400);
            }

            const paqueteDb: Paquete = {
                id: result[0].id,
                dimensiones: result[0].id_dimension,
                peso: result[0].peso,
                remitente: result[0].remitente,
                direccion_remitente: result[0].direccion_remitente,
                destinatario: result[0].destinatario,
                direccion_destinatario: result[0].direccion_destinatario,
                fecha_envio: result[0].fecha_envio,
                precio: result[0].precio
            };

            if (result[0].fecha_entrega) {
                paqueteDb.fecha_entrega = result[0].fecha_entrega;
            }

            return paqueteDb;
        } catch (error) {
            console.log(error);
            throw new ErrorPersonalizado('La conexión a la base de datos no ha funcionado', 500);
        }
    }

    async getPaquete(id: string): Promise<Paquete> {

        const query = `SELECT p.fecha_entrega, p.fecha_envio, p.id AS paquete_id, p.id_dimension, p.peso, p.precio, ur.id AS remitente_id, ur.nombre AS remitente_nombre, ur.apellidos AS remitente_apellidos, ur.correo AS remitente_correo, ur.contraseña AS remitente_contraseña, ur.telefono AS remitente_telefono, sur.id AS remitente_sucursal_id, sur.nombre AS remitente_sucursal_nombre, dr.id AS direccion_remitente_id, dr.calle AS direccion_remitente_calle, dr.numero AS direccion_remitente_numero, dr.codigo_postal AS direccion_remitente_codigo_postal, dr.localidad AS direccion_remitente_localidad, dr.provincia AS direccion_remitente_provincia, ud.id AS destinatario_id, ud.nombre AS destinatario_nombre, ud.apellidos AS destinatario_apellidos, ud.correo AS destinatario_correo, ud.contraseña AS destinatario_contraseña, ud.telefono AS destinatario_telefono, sud.id AS destinatario_sucursal_id, sud.nombre AS destinatario_sucursal_nombre, dd.id AS direccion_destinatario_id, dd.calle AS direccion_destinatario_calle, dd.numero AS direccion_destinatario_numero, dd.codigo_postal AS direccion_destinatario_codigo_postal, dd.localidad AS direccion_destinatario_localidad, dd.provincia AS direccion_destinatario_provincia FROM Paquete p JOIN Usuario ur ON p.remitente = ur.id JOIN Direccion dr ON p.direccion_remitente = dr.id LEFT JOIN Sucursal sur ON ur.sucursal = sur.id JOIN Usuario ud ON p.destinatario = ud.id JOIN Direccion dd ON p.direccion_destinatario = dd.id LEFT JOIN Sucursal sud ON ud.sucursal = sud.id WHERE p.id = $1;`;
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
            direccion_destinatario: direccionDestinatario,
            fecha_entrega: row.fecha_entrega,
        };

        if (result[0].fecha_entrega) {
            paquete.fecha_entrega = result[0].fecha_entrega;
        }

        return paquete;

    }

    async getPaquetesByUsuario(id: string): Promise<Paquete[]> {
        const query = `SELECT p.fecha_entrega, p.fecha_envio, p.id AS paquete_id, p.id_dimension, p.peso, p.precio, ur.id AS remitente_id, ur.nombre AS remitente_nombre, ur.apellidos AS remitente_apellidos, ur.correo AS remitente_correo, ur.contraseña AS remitente_contraseña, ur.telefono AS remitente_telefono, sur.id AS remitente_sucursal_id, sur.nombre AS remitente_sucursal_nombre, dr.id AS direccion_remitente_id, dr.calle AS direccion_remitente_calle, dr.numero AS direccion_remitente_numero, dr.codigo_postal AS direccion_remitente_codigo_postal, dr.localidad AS direccion_remitente_localidad, dr.provincia AS direccion_remitente_provincia, ud.id AS destinatario_id, ud.nombre AS destinatario_nombre, ud.apellidos AS destinatario_apellidos, ud.correo AS destinatario_correo, ud.contraseña AS destinatario_contraseña, ud.telefono AS destinatario_telefono, sud.id AS destinatario_sucursal_id, sud.nombre AS destinatario_sucursal_nombre, dd.id AS direccion_destinatario_id, dd.calle AS direccion_destinatario_calle, dd.numero AS direccion_destinatario_numero, dd.codigo_postal AS direccion_destinatario_codigo_postal, dd.localidad AS direccion_destinatario_localidad, dd.provincia AS direccion_destinatario_provincia FROM Paquete p JOIN Usuario ur ON p.remitente = ur.id JOIN Direccion dr ON p.direccion_remitente = dr.id LEFT JOIN Sucursal sur ON ur.sucursal = sur.id JOIN Usuario ud ON p.destinatario = ud.id JOIN Direccion dd ON p.direccion_destinatario = dd.id LEFT JOIN Sucursal sud ON ud.sucursal = sud.id WHERE p.remitente = $1 OR p.destinatario = $1;`;

        try {
            const result: any[] = await executeQuery(query, [id]);

            if (result.length === 0) {
                throw new ErrorPersonalizado('Error al buscar paquete', 200);
            }

            const pedidosdb: Paquete[] = result.map((row) => {
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
                    direccion_destinatario: direccionDestinatario,
                    fecha_entrega: row.fecha_entrega,
                };

                if (row.fecha_entrega) {
                    paquete.fecha_entrega = row.fecha_entrega;
                }

                return paquete;
            });

            return pedidosdb;

        } catch(e) {
            if(e instanceof ErrorPersonalizado) throw e;
            throw new ErrorPersonalizado('La conexión a la base de datos no ha funcionado', 500);
        }
    }

    async terminarPaquete(id: string): Promise<Paquete> {
        const query = `UPDATE paquete fecha_entrega = NOW() WHERE id = $1 RETURNING *;`;
        try {
            const result = await executeQuery(query, [id]);
            if (result.length === 0) {
                throw new ErrorPersonalizado('Error al actualizar el paquete', 400);
            }

            return this.getPaquete(id);

        } catch {
            console.log("Error al terminar el paquete");
            throw new ErrorPersonalizado('La conexión a la base de datos no ha funcionado', 500);
        }
    }

    async comporbarID(id: string): Promise<boolean> {
        const query = `SELECT id FROM paquete WHERE id = '${id}'`
        try {
            const result: any[] = await executeQuery(query)
            return (result.length === 0) ? false : true
        } catch {
            throw new ErrorPersonalizado('La conexion a la base de datos no ha funcionado', 500)
        }
    }

    async calcularPrecio(paquete: Paquete | string, peso?: number): Promise<number> {
        const tarifaBase = [5.63, 6.05, 7.37, 12.6];
        const tarifa100G = [0.5, 0.4, 0.3, 0.2];

        try {
            if (typeof paquete === "object" && paquete !== null && "dimensiones" in paquete && "peso" in paquete) {
                const dimensiones = await dimensionesusecases.getDimensiones();
                const dimension = dimensiones.find((dimension) => dimension.id === paquete.dimensiones);
                if (!dimension) {
                    throw new ErrorPersonalizado('Dimensión no encontrada', 400);
                }
                switch (dimension.nombre) {
                    case "Pequeño":
                        return tarifaBase[0] + (paquete.peso - 1) * tarifa100G[0];
                    case "Mediano":
                        return tarifaBase[1] + (paquete.peso - 1) * tarifa100G[1];
                    case "Grande":
                        return tarifaBase[2] + (paquete.peso - 1) * tarifa100G[2];
                    case "Extra grande":
                        return tarifaBase[3] + (paquete.peso - 1) * tarifa100G[3];
                    default:
                        throw new ErrorPersonalizado('Nombre de dimensión no válido', 400);
                }
            }

            if (typeof paquete === "string" && peso !== undefined) {

                switch (paquete) {
                    case "Pequeño":
                        return tarifaBase[0] + (peso - 1) * tarifa100G[0];
                    case "Mediano":
                        return tarifaBase[1] + (peso - 1) * tarifa100G[1];
                    case "Grande":
                        return tarifaBase[2] + (peso - 1) * tarifa100G[2];
                    case "Extra grande":
                        return tarifaBase[3] + (peso - 1) * tarifa100G[3];
                    default:
                        throw new ErrorPersonalizado('Nombre de dimensión no válido', 400);
                }
            }

            throw new ErrorPersonalizado('Datos de entrada no válidos', 400);
        } catch (error) {
            console.log(error);
            throw new ErrorPersonalizado('Error al calcular el precio', 400);
        }
    }

}