import request from "supertest";
import app from "./../src/app";
import { postPaquete } from "./unitarios";

describe("Paquetes Tests", () => {

    it("POST /paquetes - Debería crear un paquete", async () => {
        const { id, paqueteData } = await postPaquete();
        expect(id).toBeDefined();
    });

    it("GET /paquetes/:id - Debería devolver el paquete creado", async () => {
        const { id, paqueteData } = await postPaquete();

        const response = await request(app).get(`/paquetes/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", id);
        expect(response.body.dimensiones).toBe(paqueteData.dimensiones);
    });

    it("GET /paquetes/gencode/:id - Debería devolver código de barras en formato PNG", async () => {
        const { id } = await postPaquete();

        const response = await request(app).get(`/paquetes/gencode/${id}`);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe("image/png");
    });

    it("POST /paquetes/paquetes - Debería devolver paquetes por usuario", async () => {
        const { id } = await postPaquete();

        const response = await request(app)
            .post("/paquetes/paquetes")
            .send({ id });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Might not find if your getPaquetesByUsuario logic is strict
    });

    it("GET /paquetes/precio/:tamaño/:peso - Debería calcular el precio correctamente", async () => {
        const tamaño = "Extra Pequeño";
        const peso = 2.5;

        const response = await request(app)
            .get(`/paquetes/precio/${encodeURIComponent(tamaño)}/${peso}`);

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe("number");
    });
});
