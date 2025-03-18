import executeQuery from "../../../../context/postgres.db";
import Usuario from "../../../usuarios/domain/Usuario";
import Direccion from "../../domain/Direccion";
import direccionesRepository from "../../domain/direcciones.repository";

export default class DireccionesRepositoryPostgres implements direccionesRepository {
    
    async getDireccionesUsuario(id: string): Promise<Direccion[]> {
        const query = `SELECT * FROM Direccion WHERE idUsuario = ?}`;

        const response = await executeQuery(query, [id]);

        const direcciones: Direccion[] = response.map((direccion: any) => {
            return {
                id: direccion.id,
                calle: direccion.calle,
                numero: direccion.numero,
                codigoPostal: direccion.codigoPostal,
                localidad: direccion.localidad,
                provincia: direccion.provincia,
                pais: direccion.pais
            }
        });

        return direcciones;
    }

    async nuevaDireccionUsuario(usuario: Usuario, direccion: Direccion): Promise<Direccion> {
        const result = await this.nuevaDireccion(direccion);
        const direccionId = result.id;

        const usuarioDireccionQuery = `
            INSERT INTO Usuario_Direccion (usuario_id, direccion_id)
            VALUES ($1, $2)
        `;

        await executeQuery(usuarioDireccionQuery, [usuario.id, direccionId]);

        return {
            ...direccion,
            id: direccionId
        };
    }

    async getDireccionById(id: number): Promise<Direccion> {
        const query = `SELECT * FROM Direccion WHERE id = ?`;

        const response:any = await executeQuery(query, [id]);

        if (response.length === 0) {
            throw new Error("Direccion no encontrada");
        }

        return {
            id: response[0].id,
            calle: response[0].calle,
            numero: response[0].numero,
            codigoPostal: response[0].codigoPostal,
            localidad: response[0].localidad,
            provincia: response[0].provincia,
            pais: response[0].pais
        };
    }
    
    async nuevaDireccion(direccion: Direccion): Promise<Direccion> {
        const query = `
            INSERT INTO Direccion (calle, numero, codigo_postal, localidad, provincia, pais)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        const values = [
            direccion.calle,
            direccion.numero,
            direccion.codigoPostal,
            direccion.localidad,
            direccion.provincia,
            direccion.pais
        ];

        const response: any = await executeQuery(query, values);

        return {
            ...direccion,
            id: response[0].id
        };

    }
    
    async updateDireccion(direccion: Direccion): Promise<Direccion> {
        const query = `
            UPDATE Direccion
            SET calle = $1, numero = $2, codigo_postal = $3, localidad = $4, provincia = $5, pais = $6
            WHERE id = $7
        `;

        const values = [
            direccion.calle,
            direccion.numero,
            direccion.codigoPostal,
            direccion.localidad,
            direccion.provincia,
            direccion.pais,
            direccion.id
        ];

        await executeQuery(query, values);

        return direccion;
    }

    
    async eliminarDireccion(id: number): Promise<Direccion> {
        throw new Error("Method not implemented.");
    }
    
}