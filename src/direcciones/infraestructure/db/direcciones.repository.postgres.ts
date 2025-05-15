import executeQuery from "../../../../context/postgres.db";
import Direccion from "../../domain/Direccion";
import direccionesRepository from "../../domain/direcciones.repository";

export default class DireccionesRepositoryPostgres implements direccionesRepository {
    
    async getDireccionesUsuario(id: string): Promise<Direccion[]> {
        const query = `
            SELECT d.id, d.calle, d.numero, d.codigo_postal AS "codigoPostal", 
                   d.localidad, d.provincia, d.pais
            FROM usuario_direccion ud
            JOIN direccion d ON ud.direccion = d.id
            WHERE ud.usuario = $1 && d.es_temporal = false;
        `;
    
        const response = await executeQuery(query, [id]);
    
        return response.map((direccion: any) => ({
            id: direccion.id,
            calle: direccion.calle,
            numero: direccion.numero,
            codigoPostal: direccion.codigoPostal,
            localidad: direccion.localidad,
            provincia: direccion.provincia,
            pais: direccion.pais
        }));
    }
    

    async nuevaDireccionUsuario(usuario: string, direccion: Direccion, es_temporal:boolean): Promise<Direccion> {
        const result = await this.nuevaDireccion(direccion,es_temporal);
        const direccionId = result.id;

        const usuarioDireccionQuery = `
            INSERT INTO usuario_direccion (usuario, direccion)
            VALUES ($1, $2)
        `;

        await executeQuery(usuarioDireccionQuery, [usuario, direccionId]);

        return {
            ...direccion,
            id: direccionId
        };
    }

    async getDireccionById(id: number): Promise<Direccion> {
        const query = `SELECT * FROM direccion WHERE id = $1`;

        const response: any[] = await executeQuery(query, [id]);

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
    
    async nuevaDireccion(direccion: Direccion,es_temporal: boolean): Promise<Direccion> {
        const query = `
            INSERT INTO Direccion (calle, numero, codigo_postal, localidad, provincia, pais, es_temporal)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            direccion.calle,
            direccion.numero,
            direccion.codigoPostal,
            direccion.localidad,
            direccion.provincia,
            direccion.pais,
            es_temporal
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
        const query = `DELETE FROM Direccion WHERE id = $1 RETURNING *`;
        const response: any = await executeQuery(query, [id]);

        if (response.length === 0) {
            throw new Error("Direccion no encontrada");
        }

        return {
            id: response[0].id,
            calle: response[0].calle,
            numero: response[0].numero,
            codigoPostal: response[0].codigo_postal,
            localidad: response[0].localidad,
            provincia: response[0].provincia,
            pais: response[0].pais
        };
    }
    
}